const { InvoiceTC, InvoiceItemTC } = require('../../invoice/invoice.model');


const InvoiceMutation = {
  invoiceCreateOne: InvoiceTC.getResolver('createOne'),
  invoiceCreateMany: InvoiceTC.getResolver('createMany'),
  invoiceUpdateById: InvoiceTC.getResolver('updateById'),
  invoiceUpdateOne: InvoiceTC.getResolver('updateOne'),
  invoiceUpdateMany: InvoiceTC.getResolver('updateMany'),
  invoiceRemoveById: InvoiceTC.getResolver('removeById'),
  invoiceRemoveOne: InvoiceTC.getResolver('removeOne'),
  invoiceRemoveMany: InvoiceTC.getResolver('removeMany'),

  invoiceItemCreateOne: InvoiceItemTC.getResolver('createOne'),
  invoiceItemCreateMany: InvoiceItemTC.getResolver('createMany'),
  invoiceItemUpdateById: InvoiceItemTC.getResolver('updateById'),
  invoiceItemUpdateOne: InvoiceItemTC.getResolver('updateOne'),
  invoiceItemUpdateMany: InvoiceItemTC.getResolver('updateMany'),
  invoiceItemRemoveById: InvoiceItemTC.getResolver('removeById'),
  invoiceItemRemoveOne: InvoiceItemTC.getResolver('removeOne'),
  invoiceItemRemoveMany: InvoiceItemTC.getResolver('removeMany'),
  invoiceSummary: InvoiceTC.addRelation(
    'invoiceSummary',
    {
      resolver: InvoiceTC.getResolver('getSummary'),
      projection: { _id: true }, // Make sure we had the parent _id to be able to filter it out
    },
  ),
  invoiceItemDetails: InvoiceTC.addRelation(
    'invoiceDetails',
    {
      resolver: () => InvoiceItemTC.get('$findMany'), // shorthand for `UserTC.getResolver('findMany')`
      prepareArgs: { // resolver `findMany` has `filter` arg, we may provide mongoose query to it
        filter: source => ({
          _operators: { // Applying criteria on fields which have
            // operators enabled for them (by default, indexed fields only)
            invoice_no: source.invoice_no,
          },
        }),
      },
      projection: { invoice_no: 1 }, // required fields from source object
    },
  ),
};

module.exports = { InvoiceMutation };
