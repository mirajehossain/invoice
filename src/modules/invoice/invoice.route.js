const express = require('express');
const schema = require('./invoice.schema');
const { JOI } = require('../../config/constants');
const middleware = require('../../middleware');

const InvoiceController = require('./invoice.controller');

const router = express.Router();

router.get('/', InvoiceController.getInvoices);
router.get('/:invoiceNo', InvoiceController.getInvoice);

router.post('/',
  middleware.joiValidator(schema.createInvoice, JOI.property.body),
  InvoiceController.createInvoice);
module.exports = router;
