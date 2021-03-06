const { invoiceStatus } = require('../../config/constants');
const { InvoiceModel, InvoiceItemModel } = require('./invoice.model');

module.exports = {
  async createInvoice(req, res) {
    try {
      const { body } = req;

      const total = body.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      const userId = body.user_id ? body.user_id : req.user._id;
      const payload = {
        user_id: userId,
        address: body.address,
        contact_number: body.contact_number,
        status: invoiceStatus.pending,
        total,
      };

      const invoice = await InvoiceModel.create(payload);
      const invoiceItems = body.items.map(item => ({ ...item, invoice_no: invoice.invoice_no }));

      await InvoiceItemModel.insertMany(invoiceItems);

      return res.status(201).send({
        success: true,
        message: 'invoice created successfully',
        data: invoice,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },

  async invoiceSummary(req, res) {
    try {
      let { startDate, endDate } = req.query;
      const { page = 1, limit = 10 } = req.query;
      const skip = Number(limit) * (Number(page) - 1);
      const filter = {};

      if (startDate && endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);
        filter.created_at = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const summary = await InvoiceModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              created_at: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
              customer: '$user_id',
            },
            invoiceCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users', localField: '_id.customer', foreignField: '_id', as: 'details',
          },
        },
        { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
        { $project: { 'details.created_at': 0, 'details.updated_at': 0 } },
        {
          $group: {
            _id: '$_id.created_at',
            invoices: {
              $push: {
                user: '$details',
                invoice_count: '$invoiceCount',
              },
            },
            total_invoice_count: { $sum: '$invoiceCount' },
          },
        },
        { $sort: { total_invoice_count: -1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            total_invoice_count: '$total_invoice_count',
            users: '$invoices',
          },
        },
      ]).skip(skip).limit(Number(limit));

      return res.status(200).send({
        success: true,
        message: 'Summary',
        data: summary,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },

  async getInvoices(req, res) {
    try {
      const { page = 1, limit = 10, invoiceNo } = req.query;
      const filter = {};
      const skip = Number(limit) * (Number(page) - 1);

      if (invoiceNo) {
        filter.invoice_no = invoiceNo;
      }

      const itemLookup = {
        $lookup: {
          from: 'invoice_items',
          localField: 'invoice_no',
          foreignField: 'invoice_no',
          as: 'invoice_items',
        },
      };

      const userLookup = {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      };

      const invoices = await InvoiceModel.aggregate([
        { $match: filter },
        itemLookup,
        userLookup,
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'user.password': 0,
          },
        },
      ]).sort({ created_at: -1 }).skip(skip)
        .limit(Number(limit));

      const count = await InvoiceModel.countDocuments(filter);

      return res.status(200).send({
        success: true,
        message: 'Invoices',
        count,
        data: invoices,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },

  async getInvoice(req, res) {
    try {
      const { invoiceNo } = req.params;
      const filter = {
        invoice_no: invoiceNo,
      };

      const itemLookup = {
        $lookup: {
          from: 'invoice_items',
          localField: 'invoice_no',
          foreignField: 'invoice_no',
          as: 'invoice_items',
        },
      };

      const userLookup = {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      };

      const invoice = await InvoiceModel.aggregate([
        { $match: filter },
        itemLookup,
        userLookup,
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      ]);

      return res.status(200).send({
        success: true,
        message: 'Invoice details',
        data: invoice.length ? invoice[0] : {},
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },

  async updateInvoice(req, res) {
    try {
      const { invoiceNo } = req.params;

      // only contact number and address can be modified.
      const payload = req.body;

      const invoice = await InvoiceModel.findOne({ invoice_no: invoiceNo });

      if (!invoice) {
        return res.status(400).send({
          success: false,
          message: 'invoice not found',
        });
      }

      const updatedInvoice = await InvoiceModel
        .findOneAndUpdate({ invoice_no: invoiceNo }, payload, { new: true });

      return res.send({
        success: true,
        message: 'invoice updated successfully',
        data: updatedInvoice,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },
};
