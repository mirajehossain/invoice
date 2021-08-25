const faker = require('faker');
const bcrypt = require('bcryptjs');
const { userType } = require('../../../config/constants');
const { UserTC, UserModel } = require('../../user/user.model');

const resolver = function () {};
resolver.fakeData = UserTC.addResolver({
  name: 'user',
  type: UserTC,
  args: { record: UserTC.getInputType() },
  // eslint-disable-next-line no-unused-vars
  resolve: async ({ source, args }) => {
    const hashPass = bcrypt.hashSync('123456', Number(process.env.SALT_ROUND));
    const name = faker.name.findName();
    const user = new UserModel({
      name,
      username: faker.internet.userName(name),
      mobile: faker.phone.phoneNumber(),
      image: faker.random.image(),
      password: hashPass,
      userType: [userType.user],
    });
    return await user.save();
  },
});

module.exports = resolver;
