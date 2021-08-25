const BearerStrategy = require('passport-http-bearer');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../user/user.model');

module.exports.BearerStrategy = new BearerStrategy(
  async (token, done) => {
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      const user = await UserModel
        .findOne({ username: decodedToken.username }, { password: 0 })
        .lean();
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
      // req.authInfo
    } catch (e) {
      return done(e);
    }
  },
);

module.exports.serializeUser = (user, done) => {
  done(null, user);
};
