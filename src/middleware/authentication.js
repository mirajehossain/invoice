const jwt = require('jsonwebtoken');

module.exports = {
  generateToken(data) {
    return jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
    });
  },
};
