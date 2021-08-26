const express = require('express');
const passport = require('passport');
const http = require('http');
const dotenv = require('dotenv');
const morgan = require('morgan');

const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

const { serializeUser, GoogleStrategy } = require('./modules/auth/authenticator');
const AuthRoute = require('./modules/auth/auth.route');
const UserRoute = require('./modules/user/user.route');
const InvoiceRoute = require('./modules/invoice/invoice.route');
const db = require('./config/database');
const graphqlSchema = require('./modules/graphql/schema');

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 8000;

// initialize dotenv
dotenv.config('.env');

const extensions = ({ context }) => ({
  runTime: Date.now() - context.startTime,
});

// connect DB
db.connection().then(() => {
  console.log('database is connected');
}).catch((e) => {
  console.error(e);
});

// passport middleware
app.use(passport.initialize());
passport.serializeUser(serializeUser);
passport.use(GoogleStrategy);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use(morgan('dev'));

const corsOptions = {
  origin: true,
  methods: 'GET, POST, DELETE, PATCH, PUT, HEAD',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// graphql middleware
app.use(
  '/graphql',
  graphqlHTTP(() => ({
    context: { startTime: Date.now() },
    graphiql: true,
    schema: graphqlSchema,
    extensions,
  })),
);


// Set root route
app.get('/', (req, res) => res.send({ message: 'welcome to the api service' }));

// Routing
app.use('/api/auth/', AuthRoute);
app.use('/api/v1/*', passport.authenticate('google'));
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/invoices', InvoiceRoute);


/**
 * Unhandled promise rejection handler
 */
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
});

/**
 * 404 not found route
 */
app.use((req, res) => res.status(404).send({ error: 'Not Found' }));

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, () => {
  console.info(`Server is running on ${process.env.HOST}:${process.env.PORT}`);
});


module.exports = app;
