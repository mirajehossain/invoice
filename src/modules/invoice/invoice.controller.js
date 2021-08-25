const { invoiceStatus } = require('../../config/constants');
const { userType } = require('../../config/constants');
const { UserModel } = require('../user/user.model');
const { InvoiceModel, InvoiceItemModel } = require('./invoice.model');

module.exports = {
  async createInvoice(req, res) {
    try {
      const { body } = req;

      const total = body.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      const invoiceNo = `INV${new Date().valueOf()}`;
      const payload = {
        user_id: req.user._id,
        address: body.address,
        contact_number: body.contact_number,
        status: invoiceStatus.pending,
        total,
        invoice_no: invoiceNo,
      };

      const invoice = await InvoiceModel.create(payload);
      const invoiceItems = body.items.map(item => ({ ...item, invoice_no: invoiceNo }));

      await InvoiceItemModel.insertMany(invoiceItems);

      // add customer tag if not exists on user
      await UserModel.findOneAndUpdate({ _id: req.user._id },
        { $addToSet: { userType: userType.customer } });

      return res.status(200).send({
        success: true,
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
      let {
        startDate, endDate,
      } = req.query;

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
        { $project: { 'details.password': 0, 'details.created_at': 0, 'details.updated_at': 0 } },
        {
          $group: {
            _id: '$_id.created_at',
            invoices: {
              $push: {
                user: '$details',
                count: '$invoiceCount',
              },
            },
            count: { $sum: '$invoiceCount' },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            invoices: '$invoices',
            count: '$count',
          },
        },
      ]);

      return res.status(200).send({
        success: true,
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
      const {
        page = 1, limit = 10, invoiceNo, username,
      } = req.query;
      const filter = {};
      const skip = Number(limit) * (Number(page) - 1);
      if (username) {
        const user = await UserModel.findOne({ username });
        if (!user) {
          return res
            .status(400)
            .send({
              success: false,
              message: 'User does not found',
            });
        }

        filter.user_id = user._id;
      }

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
        data: invoices,
        count,
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
        {
          $project: {
            'user.password': 0,
          },
        },
      ]);

      return res.status(200).send({
        success: true,
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
};
