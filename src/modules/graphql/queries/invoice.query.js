const { InvoiceTC, InvoiceItemTC } = require('../../invoice/invoice.model');
const { UserTC } = require('../../user/user.model');

const InvoiceQuery = {
  invoiceById: InvoiceTC.getResolver('findById'),
  invoiceByIds: InvoiceTC.getResolver('findByIds'),
  invoiceOne: InvoiceTC.getResolver('findOne'),
  invoiceMany: InvoiceTC.getResolver('findMany'),
  invoiceCount: InvoiceTC.getResolver('count'),
  invoiceConnection: InvoiceTC.getResolver('connection'),
  invoicePagination: InvoiceTC.getResolver('pagination'),

  invoiceItemById: InvoiceItemTC.getResolver('findById'),
  invoiceItemByIds: InvoiceItemTC.getResolver('findByIds'),
  invoiceItemOne: InvoiceItemTC.getResolver('findOne'),
  invoiceItemMany: InvoiceItemTC.getResolver('findMany'),
  invoiceItemCount: InvoiceItemTC.getResolver('count'),
  invoiceItemConnection: InvoiceItemTC.getResolver('connection'),
  invoiceItemPagination: InvoiceItemTC.getResolver('pagination'),
  invoiceUser: InvoiceTC.addRelation(
    'invoiceUser',
    {
      resolver: () => UserTC.getResolver('findById'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _id: source => source.user_id,
      },
      projection: { user_id: 1 },
    },
  ),
  invoiceSummary: InvoiceTC.getResolver('getSummary'),

  invoiceItemDetails: InvoiceTC.addRelation(
    'invoiceDetails',
    {
      resolver: () => InvoiceItemTC.get('$findMany'), // shorthand for `InvoiceTC.getResolver('findMany')`
      prepareArgs: { // resolver `findMany` has `filter` arg, we may provide mongoose query to it
        filter: source => ({
          _operators: { // Applying criteria on fields which have
            // operators enabled for them (by default, indexed fields only)
            // _id : { in: source.friendsIds },
            invoice_no: source.invoice_no,
            // age: { gt: 21 }
          },
          // gender: source.gender,
        }),
        // limit: 10,
      },
      projection: { invoice_no: 1 }, // required fields from source object
    },
  ),

};

module.exports = { InvoiceQuery };
