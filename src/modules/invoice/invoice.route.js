const express = require('express');
const schema = require('./invoice.schema');
const { JOI } = require('../../config/constants');
const middleware = require('../../middleware');

const InvoiceController = require('./invoice.controller');

const router = express.Router();

router.post('/',
  middleware.joiValidator(schema.createInvoice, JOI.property.body),
  InvoiceController.createInvoice);

router.get('/', InvoiceController.getInvoices);
router.get('/summary', InvoiceController.invoiceSummary);
router.get('/:invoiceNo', InvoiceController.getInvoice);
module.exports = router;
