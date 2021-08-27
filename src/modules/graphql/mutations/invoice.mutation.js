const { InvoiceTC, InvoiceItemTC } = require('../../invoice/invoice.model');


const InvoiceMutation = {
  invoiceCreateOne: InvoiceTC.getResolver('createOne'),
  invoiceUpdateById: InvoiceTC.getResolver('updateById'),
  invoiceUpdateOne: InvoiceTC.getResolver('updateOne'),
  invoiceRemoveById: InvoiceTC.getResolver('removeById'),
  invoiceRemoveOne: InvoiceTC.getResolver('removeOne'),

  invoiceItemCreateOne: InvoiceItemTC.getResolver('createOne'),
  invoiceItemUpdateById: InvoiceItemTC.getResolver('updateById'),
  invoiceItemUpdateOne: InvoiceItemTC.getResolver('updateOne'),
  invoiceItemRemoveById: InvoiceItemTC.getResolver('removeById'),
  invoiceItemRemoveOne: InvoiceItemTC.getResolver('removeOne'),
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
      resolver: () => InvoiceItemTC.get('$findMany'),
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
