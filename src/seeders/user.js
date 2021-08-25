const bcrypt = require('bcryptjs');
const faker = require('faker');
const { userType } = require('../config/constants');
const { UserModel } = require('../modules/user/user.model');
const db = require('../config/database');

// connect DB
db.connection().then(() => {
  console.log('database is connected');
}).catch((e) => {
  console.error(e);
});


const password = '123456';
const hashPass = bcrypt.hashSync(password, Number(process.env.SALT_ROUND));

Array(30)
  .fill({ date: new Date() })
  .map(async (item, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (index));
    const name = faker.name.findName();

    const users = [
      {
        name,
        username: faker.internet.userName(name),
        mobile: faker.phone.phoneNumber(),
        image: faker.random.image(),
        password: hashPass,
        userType: [userType.user],
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      },
      {
        name,
        username: faker.internet.userName(name),
        mobile: faker.phone.phoneNumber(),
        image: faker.random.image(),
        password: hashPass,
        userType: [userType.user],
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      },
    ];
    await UserModel.insertMany(users);
    console.log(`inserting user for ${date.toLocaleDateString()}`);
    return { date: date.toISOString() };
  });
