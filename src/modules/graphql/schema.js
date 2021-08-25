const { SchemaComposer } = require('graphql-compose');


const schemaComposer = new SchemaComposer();

const { UserMutation } = require('./mutations/user.mutation');
const { UserQuery } = require('./queries/user.query');

schemaComposer.Query.addFields({
  ...UserQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
});

module.exports = schemaComposer.buildSchema();
