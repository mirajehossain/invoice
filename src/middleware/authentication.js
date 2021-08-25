const jwt = require('jsonwebtoken');
const { UserModel } = require('../modules/user/user.model');

module.exports = {
  async validateToken(req, res, next) {
    try {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        req.decoded = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        return next();
      }

      console.error('Authorization header is not set');
      return res.status(401).send({
        success: false,
        message: 'You are not authenticate user',
      });
    } catch (e) {
      console.error(e.message);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
      });
    }
  },

  generateToken(data) {
    return jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
    });
  },
};

const isAuthorized = (...userTypes) => async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.decoded.email });
    console.log(user);
    if (userTypes.includes(user.userType)) {
      return next();
    }
    return res.status(401).send({
      success: false,
      message: 'Unauthorized, User is not able to perform this action',
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: 'An error occur',
    });
  }
};

module.exports.isAuthorized = isAuthorized;
