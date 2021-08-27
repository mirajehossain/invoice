const { SchemaComposer } = require('graphql-compose');

const schemaComposer = new SchemaComposer();

const { UserMutation } = require('./mutations/user.mutation');
const { InvoiceMutation } = require('./mutations/invoice.mutation');
const { InvoiceQuery } = require('./queries/invoice.query');
const { UserQuery } = require('./queries/user.query');


// schemaComposer
schemaComposer.Query.addFields({
  ...UserQuery,
  ...InvoiceQuery,

  // Attach to a field directly on the root query
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...InvoiceMutation,
});

module.exports = schemaComposer.buildSchema();
