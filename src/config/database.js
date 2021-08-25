const mongoose = require('mongoose');
require('dotenv').config();

const connectionURI = process.env.DB_URL;
module.exports = {
  connection() {
    return mongoose.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });
  },
};
