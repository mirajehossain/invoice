const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/success', (req, res) => res.send({
  success: true,
  message: 'you are logged in successfully',
  data: req.user,
}));

router.get('/fail', (req, res) => res.status(401).send({
  success: false,
  message: 'you have failed to logged in',
}));

router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/fail' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });


module.exports = router;
