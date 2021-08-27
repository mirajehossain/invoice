process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { UserModel } = require('../modules/user/user.model');
const server = require('../app');

chai.should();
let user;


chai.use(chaiHttp);

beforeEach(async () => {
  user = await UserModel.findOne().lean();
  if (!user) {
    user = await UserModel.create({
      userType: [
        'user',
      ],
      _id: '6128c92f875d6ac3638f5341',
      google_id: '14506487786449698246092',
      name: 'john',
      email: 'john.com@gmail.com',
      created_at: '2021-08-27T11:14:55.456Z',
      updated_at: '2021-08-27T11:14:55.456Z',
    });
  }
});

/*
 * Test the /POST route
 */
describe('/POST create new invoice', () => {
  it('it should create a Invoice', (done) => {
    const invoice = {
      contact_number: '01922334455',
      address: 'Mirpur DOHS',
      user_id: user._id,
      items: [
        { name: 'Ice cream', quantity: 5, price: 40 },
        { name: 'Pen', quantity: 2, price: 10 },
      ],
    };

    chai.request(server)
      .post('/api/v1/invoices')
      .send(invoice)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
});

/*
 * Test the /GET invoices route
 */
describe('/GET Invoices', () => {
  it('it should return all the invoices', (done) => {
    chai.request(server)
      .get('/api/v1/invoices')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        done();
      });
  });
});


/*
 * Test the /GET invoice route
 */
describe('/GET invoice details or empty object if not found', () => {
  it('it should return single invoice details ', (done) => {
    chai.request(server)
      .get('/api/v1/invoices/ENV12345678')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        done();
      });
  });
});


/*
 * Test the /GET invoice summary
 */
describe('/GET invoice summary', () => {
  it('it should return invoice summary ', (done) => {
    chai.request(server)
      .get('/api/v1/invoices/summary')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        done();
      });
  });
});
