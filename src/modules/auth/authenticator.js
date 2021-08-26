const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel } = require('../user/user.model');

require('dotenv').config('.env');


module.exports.GoogleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
},
(async (accessToken, refreshToken, profile, cb) => {
  try {
    console.log(`accessToken: ${accessToken}`);
    console.log(`refreshToken: ${refreshToken}`);
    console.log(`profile: ${JSON.stringify(profile)}`);
    const user = await UserModel.findOne({ google_id: profile.id }).lean();
    if (!user) {
      // create new user;
    }
    cb(null, user);
  } catch (e) {
    cb(e, null);
  }
}));


module.exports.serializeUser = (user, done) => {
  done(null, user);
};
