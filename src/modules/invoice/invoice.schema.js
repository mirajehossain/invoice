const Joi = require('@hapi/joi');

const items = Joi.object().keys({
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
});


module.exports = {
  createInvoice: Joi.object({
    contact_number: Joi.string().required(),
    address: Joi.string().required(),
    items: Joi.array().items(items).min(1).required(),
  }),
};