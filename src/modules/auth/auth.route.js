const express = require('express');
const AuthController = require('./auth.controller');
const middleware = require('../../middleware');
const schema = require('./auth.schema');

const router = express.Router();
const { JOI } = require('../../config/constants');

// login
router.post('/login',
  middleware.joiValidator(schema.login, JOI.property.body),
  AuthController.login);

// register
router.post('/register',
  middleware.joiValidator(schema.register, JOI.property.body),
  AuthController.register);

module.exports = router;
