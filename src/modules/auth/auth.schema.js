const Joi = require('@hapi/joi');

module.exports = {
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  register: Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required()
      .error(() => new Error('"name" is required should at least 3 and maximum 30 characters long.')),
    mobile: Joi.number(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
