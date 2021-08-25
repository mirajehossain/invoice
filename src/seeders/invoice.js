const faker = require('faker');
const { userType } = require('../config/constants');
const { UserModel } = require('../modules/user/user.model');
const { InvoiceModel, InvoiceItemModel } = require('../modules/invoice/invoice.model');
const db = require('../config/database');
const { invoiceStatus } = require('../config/constants');

// connect DB
db.connection().then(() => {
  console.log('database is connected');
}).catch((e) => {
  console.error(e);
});

Promise.all(Array(30)
  .fill({ date: new Date() })
  .map(async (item, index) => {
    const users = await UserModel.find().limit(6).lean();
    const date = new Date();
    date.setDate(date.getDate() - (index));
    const userIndex = Math.floor(Math.random() * 5) + 1;
    const user = users[userIndex];
    const items = [
      {
        name: faker.commerce.productName(),
        quantity: faker.datatype.number(),
        price: faker.commerce.price(),
      },
    ];
    const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const invoiceNo = `INV${new Date().valueOf()}`;
    const payload = {
      user_id: user._id,
      address: faker.address.streetAddress(),
      contact_number: faker.phone.phoneNumber(),
      status: invoiceStatus.pending,
      total,
      invoice_no: invoiceNo,
      created_at: date,
      updated_at: date,
    };

    await InvoiceModel.create(payload);
    const invoiceItems = items.map(invItem => ({ ...invItem, invoice_no: invoiceNo }));

    await InvoiceItemModel.insertMany(invoiceItems);

    // add customer tag if not exists on user
    await UserModel.findOneAndUpdate({ _id: user._id },
      { $addToSet: { userType: userType.customer } });
    console.log(`inserting invoice for ${date.toLocaleDateString()}`);
    return { date: date.toISOString() };
  }));
