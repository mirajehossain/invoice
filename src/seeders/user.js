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
        image: faker.random.image(),
        email: faker.internet.email(),
        google_id: faker.datatype.uuid(),
        userType: [userType.user],
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      },
      {
        name,
        username: faker.internet.userName(name),
        google_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        image: faker.random.image(),
        userType: [userType.user],
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      },
    ];
    await UserModel.insertMany(users);
    console.log(`inserting user for ${date.toLocaleDateString()}`);
    return { date: date.toISOString() };
  });
