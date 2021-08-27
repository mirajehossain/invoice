const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel } = require('../user/user.model');
const { userType } = require('../../config/constants');

require('dotenv').config('.env');


module.exports.GoogleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
},
(async (accessToken, refreshToken, profile, cb) => {
  try {
    console.log(`accessToken: ${accessToken.toString()}`);
    console.log(`refreshToken: ${refreshToken}`);
    console.log(`profile: ${JSON.stringify(profile)}`);
    let user = await UserModel.findOne({ google_id: profile.id }).lean();
    if (!user) {
    // create new user;
      const profileImage = profile.photos.length ? profile.photos[0].value : null;
      const email = profile.photos.length ? profile.emails[0].value : null;
      const payload = {
        google_id: profile.id,
        name: profile.displayName,
        image: profileImage,
        email,
        userType: [userType.user],
      };
      user = await UserModel.create(payload);
    }
    cb(null, user);
  } catch (e) {
    cb(e, null);
  }
}));


module.exports.serializeUser = (user, done) => {
  done(null, user);
};


module.exports.deserializeUser = (user, done) => {
  done(null, user);
};
