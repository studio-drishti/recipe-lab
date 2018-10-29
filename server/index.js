const mongoose = require('mongoose');
// Load Next.js dependencies and Next Auth config
const next = require('next');
const nextConfig = require('../next.config.js');
const nextAuth = require('next-auth');
const nextAuthConfig = require('./next-auth.config');

const db = require('./models');
const routes = require('./routes');

// Load environment variables
// require('dotenv').load()

process.on('uncaughtException', function(err) {
  console.error('Uncaught Exception: ', err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason);
});

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 80;

process.env.MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/schooled-lunch';

// Initialize the Next.js app
const nextApp = next({
  dir: './client',
  dev: process.env.NODE_ENV !== 'production',
  conf: nextConfig
});

nextApp
  .prepare()
  .then(() => {
    // Ensure that we are connected to mongo
    return mongoose.connect(
      process.env.MONGO_URI,
      {
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
    expressApp.use(routes);

    expressApp.get('/recipes/:id', (req, res) => {
      const actualPage = '/recipe';
      nextApp.render(req, res, actualPage, req.params);
    });

    expressApp.all('*', (req, res) => {
      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    expressApp.listen(process.env.PORT, err => {
      if (err) throw err;
      console.log(`🍽  Ready on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
