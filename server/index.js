const mongoose = require('mongoose');

const next = require('next');
const nextConfig = require('../next.config.js');
const nextAuth = require('next-auth');
const nextAuthConfig = require('./next-auth.config');

const morgan = require('morgan');
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const routes = require('./routes');

const {
  NODE_ENV,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DATABASE_NAME
} = process.env;

// process.on('uncaughtException', function(err) {
//   console.error('Uncaught Exception: ', err);
// });

// process.on('unhandledRejection', (reason, p) => {
//   console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason);
// });

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// process.env.PORT = process.env.PORT || 80;

// Initialize the Next.js app
const nextApp = next({
  dir: './client',
  dev: NODE_ENV !== 'production',
  conf: nextConfig
});

module.exports = nextApp
  .prepare()
  .then(() => {
    // Ensure that we are connected to mongo
    return mongoose.connect(
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`,
      {
        dbName: MONGO_DATABASE_NAME,
        useNewUrlParser: true
      }
    );
  })
  .then(() => {
    // Load configuration and return config object
    return nextAuthConfig();
  })
  .then(nextAuthOptions => {
    // Don't pass a port to NextAuth so we can use custom express routes
    if (nextAuthOptions.port) delete nextAuthOptions.port;
    return nextAuth(nextApp, nextAuthOptions);
  })
  .then(({ expressApp }) => {
    expressApp.use(morgan('common'));
    expressApp.use(routes);

    expressApp.get('/recipes/:id', (req, res) => {
      const actualPage = '/recipe';
      nextApp.render(req, res, actualPage, req.params);
    });

    expressApp.all('*', (req, res) => {
      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    // expressApp.listen(process.env.PORT, err => {
    //   if (err) throw err;
    //   console.info(`🍽  Ready on http://localhost:${process.env.PORT}`);
    // });
    return expressApp;
  })
  .catch(ex => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
