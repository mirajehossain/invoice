const {
  GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLList,
} = require('graphql');

const CustomUserType = new GraphQLObjectType({
  name: 'CustomUserType',
  fields: () => ({
    userType: {
      type: new GraphQLList(GraphQLString),
    },
    name: { type: GraphQLString },
  }),
});

const InvoiceUserType = new GraphQLObjectType({
  name: 'InvoiceUserType',
  fields: {
    invoice_count: { type: GraphQLInt },
    user: {
      type: CustomUserType,
    },
  },
});

const InvoiceSummaryType = new GraphQLObjectType({
  name: 'InvoiceSummaryType',
  description: 'This represent Invoices summary',
  fields: () => ({
    date: { type: GraphQLString },
    total_invoice_count: { type: GraphQLInt },
    users: { type: new GraphQLList(InvoiceUserType) },
  }),
});

module.exports = InvoiceSummaryType;
