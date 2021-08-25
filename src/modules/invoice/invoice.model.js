const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');

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

}, { versionKey: false, timestamps: true });

const InvoiceModel = mongoose.model('invoices', InvoiceSchema);

const InvoiceItemSchema = new Schema({
  invoice_no: { type: String, required: true },
  name: { type: Schema.Types.String },
  quantity: { type: Schema.Types.Number },
  price: { type: Schema.Types.Number },

}, { versionKey: false, timestamps: true });

const InvoiceItemModel = mongoose.model('invoice_items', InvoiceItemSchema);
module.exports = {
  InvoiceModel,
  InvoiceItemModel,
  InvoiceTC: composeWithMongoose(InvoiceModel),
  InvoiceItemTC: composeWithMongoose(InvoiceItemModel),
};
