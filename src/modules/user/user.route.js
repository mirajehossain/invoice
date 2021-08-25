const express = require('express');
// const schema = require('./user.schema');
// const { JOI } = require('../../config/constants');

const UserController = require('./user.controller');

const router = express.Router();

router.get('/', UserController.getUsers);
module.exports = router;
