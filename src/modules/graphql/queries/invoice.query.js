const { InvoiceTC, InvoiceItemTC } = require('../../invoice/invoice.model');
const { UserTC } = require('../../user/user.model');

const InvoiceQuery = {
  invoiceById: InvoiceTC.getResolver('findById'),
  invoiceByIds: InvoiceTC.getResolver('findByIds'),
  invoiceOne: InvoiceTC.getResolver('findOne'),
  invoiceMany: InvoiceTC.getResolver('findMany'),
  invoiceCount: InvoiceTC.getResolver('count'),

  invoiceItemById: InvoiceItemTC.getResolver('findById'),
  invoiceItemByIds: InvoiceItemTC.getResolver('findByIds'),
  invoiceItemOne: InvoiceItemTC.getResolver('findOne'),
  invoiceItemMany: InvoiceItemTC.getResolver('findMany'),
  invoiceItemCount: InvoiceItemTC.getResolver('count'),
  invoiceUser: InvoiceTC.addRelation(
    'invoiceUser',
    {
      resolver: () => UserTC.getResolver('findById'),
      prepareArgs: {
        _id: source => source.user_id,
      },
      projection: { user_id: 1 },
    },
  ),
  invoiceSummary: InvoiceTC.getResolver('getSummary'),

  invoiceItemDetails: InvoiceTC.addRelation(
    'invoiceDetails',
    {
      resolver: () => InvoiceItemTC.get('$findMany'),
      prepareArgs: {
        filter: source => ({
          _operators: { // Applying criteria on fields which have
            invoice_no: source.invoice_no,
          },
        }),
      },
      projection: { invoice_no: 1 }, // required fields from source object
    },
  ),

};

module.exports = { InvoiceQuery };
