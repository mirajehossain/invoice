const { GraphQLList } = require('graphql');
const InvoiceSummaryType = require('../types/custom.invoice.summery');

// Accepting the TC and the model in order to implement the aggregation resolve
module.exports.AddGetSummaryResolver = (TC, Model) => {
  TC.addResolver({
    name: 'getSummary',
    type: new GraphQLList(InvoiceSummaryType),
    kind: 'query',
    resolve: async () => {
      const rootAggregate = Model.aggregate(); // Aggregate root to build upon

      rootAggregate.group({
        _id: {
          created_at: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          customer: '$user_id',
        },
        invoiceCount: { $sum: 1 },
      });

      rootAggregate.lookup({
        from: 'users', localField: '_id.customer', foreignField: '_id', as: 'details',
      });

      rootAggregate.unwind({ path: '$details', preserveNullAndEmptyArrays: true });
      rootAggregate.project({ 'details.created_at': 0, 'details.updated_at': 0 });

      rootAggregate.group({
        _id: '$_id.created_at',
        invoices: {
          $push: {
            user: '$details',
            invoice_count: '$invoiceCount',
          },
        },
        total_invoice_count: { $sum: '$invoiceCount' },
      });

      // We always sort by top rank first
      rootAggregate.sort({ total_invoice_count: -1 });

      rootAggregate.project({
        _id: 0,
        date: '$_id',
        users: '$invoices',
        total_invoice_count: '$total_invoice_count',
      });

      return await rootAggregate.then(results => results.map(obj => obj));
    },
  });
};
