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
    user_id: Joi.string(),
    items: Joi.array().items(items).min(1).required(),
  }),

  updateInvoice: Joi.object({
    contact_number: Joi.string(),
    address: Joi.string(),
    status: Joi.string(),
  }),
};
