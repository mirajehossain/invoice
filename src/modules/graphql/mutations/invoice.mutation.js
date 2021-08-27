const { InvoiceTC, InvoiceItemTC } = require('../../invoice/invoice.model');


const InvoiceMutation = {
  invoiceCreateOne: InvoiceTC.getResolver('createOne'),
  invoiceUpdateById: InvoiceTC.getResolver('updateById'),
  invoiceUpdateOne: InvoiceTC.getResolver('updateOne'),
  invoiceRemoveById: InvoiceTC.getResolver('removeById'),
  invoiceRemoveOne: InvoiceTC.getResolver('removeOne'),

  invoiceItemCreateOne: InvoiceItemTC.getResolver('createOne'),
  invoiceItemCreateMany: InvoiceItemTC.getResolver('createMany'),
  invoiceItemUpdateById: InvoiceItemTC.getResolver('updateById'),
  invoiceItemUpdateOne: InvoiceItemTC.getResolver('updateOne'),
  invoiceItemRemoveById: InvoiceItemTC.getResolver('removeById'),
  invoiceItemRemoveOne: InvoiceItemTC.getResolver('removeOne'),
};

module.exports = { InvoiceMutation };
