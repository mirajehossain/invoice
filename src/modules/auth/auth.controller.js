const bcrypt = require('bcryptjs');

const { UserModel } = require('../user/user.model');
const middleware = require('../../middleware');
const { userType } = require('../../config/constants');

module.exports = {
  async login(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ username: payload.username }).lean();
      if (user) {
        const matched = bcrypt.compareSync(payload.password, user.password);

        if (matched) {
          const tokenObject = {
            _id: user._id,
            name: user.name,
            username: user.username,
            userType: user.userType,
          };

          const accessToken = middleware.authentication.generateToken(tokenObject);
          return res.status(200).send({
            message: 'Successfully logged-in',
            data: {
              accessToken,
            },
          });
        }
        return res.status(400).send({
          success: false,
          message: 'Incorrect username or password',
        });
      }
      return res.status(400).send({
        success: false,
        message: 'User does not exists',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({});
    }
  },

  async register(req, res) {
    try {
      const payload = req.body; // username, password, name,

      console.log(payload);

      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));
      payload.userType = [userType.user]; // user, customer

      const isExists = await UserModel.findOne({ username: payload.username });
      if (!isExists) {
        const user = await UserModel.create(payload);
        const tokenObject = {
          _id: user._id,
          name: user.name,
          username: user.username,
          userType: user.userType,
        };

        const accessToken = middleware.authentication.generateToken(tokenObject);
        return res.status(200).send({
          success: true,
          message: 'Successfully registered',
          data: { accessToken },
        });
      }
      return res.status(409).send({
        success: false,
        message: 'Username already exists',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
      });
    }
  },
};
