const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { AddGetSummaryResolver } = require('../graphql/resolvers/summary.resolver');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  invoice_no: {
    type: Schema.Types.String, required: true, unique: true, index: true,
  },
  user_id: { type: Schema.Types.ObjectId, required: true },
  contact_number: { type: Schema.Types.String },
  address: { type: Schema.Types.String },
  status: { type: Schema.Types.String },
  total: { type: Schema.Types.Number },

}, { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const InvoiceModel = mongoose.model('invoices', InvoiceSchema);

const InvoiceItemSchema = new Schema({
  invoice_no: { type: String, required: true },
  name: { type: Schema.Types.String },
  quantity: { type: Schema.Types.Number },
  price: { type: Schema.Types.Number },

}, { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const InvoiceItemModel = mongoose.model('invoice_items', InvoiceItemSchema);
const InvoiceTC = composeWithMongoose(InvoiceModel);
const InvoiceItemTC = composeWithMongoose(InvoiceItemModel);

AddGetSummaryResolver(InvoiceTC, InvoiceModel); // Attach the resolver
InvoiceTC.addRelation(
  'invoiceSummary',
  {
    resolver: () => InvoiceTC.getResolver('getSummary'),
  },
);


module.exports = {
  InvoiceModel,
  InvoiceItemModel,
  InvoiceTC,
  InvoiceItemTC,
};
