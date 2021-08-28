const { UserModel } = require('./user.model');

module.exports = {
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, userType } = req.query;
      const filter = {};
      const skip = Number(limit) * (Number(page) - 1);

      if (userType) {
        filter.userType = { $in: [userType] };
      }
      const users = await UserModel
        .find(filter, { password: 0 })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const count = await UserModel.countDocuments(filter);
      return res.status(200).send({
        success: true,
        message: 'All users',
        count,
        data: users,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: false,
        message: 'An error occur',
        error: e.message,
      });
    }
  },
};
