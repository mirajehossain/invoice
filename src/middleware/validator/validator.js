const validatorMiddleware = (schema, property) => async (req, res, next) => {
  try {
    // property = 'body', 'query', 'params'
    const { error } = await schema.validateAsync(req[property]);
    console.log('error:---', error);
    if (!error) return next();

    return res.status(422).send({
      success: false,
      message: error.message,
    });
  } catch (e) {
    return res.status(422).send({
      success: false,
      message: e.message,
    });
  }
};
module.exports = validatorMiddleware;
