module.exports = {
  isLoggedIn(req, res, next) {
    if (req.user) {
      return next();
    }
    return res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  },

};
