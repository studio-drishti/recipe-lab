const path = require('path');
const mongoose = require('mongoose');
const next = require('next');
const nextConfig = require('../next.config.js');
const express = require('express');
const cors = require('cors');
const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const resolvers = require('./resolvers');
const permissions = require('./permissions');
const morgan = require('morgan');
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const routes = require('./routes');

const {
  NODE_ENV
  // MONGO_USERNAME,
  // MONGO_PASSWORD,
  // MONGO_HOSTNAME,
  // MONGO_PORT,
  // MONGO_DATABASE_NAME
} = process.env;

// Initialize the Next.js app
const nextApp = next({
  dir: './client',
  dev: NODE_ENV !== 'production',
  conf: nextConfig
});

module.exports = nextApp
  .prepare()
  // .then(() => {
  //   // Ensure that we are connected to mongo
  //   return mongoose.connect(
  //     `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`,
  //     {
  //       dbName: MONGO_DATABASE_NAME,
  //       useNewUrlParser: true
  //     }
  //   );
  // })
  // .then(mongoose => {
  //   // Load configuration and return config object
  //   return nextAuthConfig(mongoose);
  // })
  // .then(nextAuthOptions => {
  //   // Don't pass a port to NextAuth so we can use custom express routes
  //   if (nextAuthOptions.port) delete nextAuthOptions.port;
  //   // Override lusca settings so we can allow multipart form submissions
  //   nextAuthOptions.csrf = { blacklist: ['/api/avatars/upload'] };
  //   return nextAuth(nextApp, nextAuthOptions);
  // })
  .then(() => {
    return new GraphQLServer({
      typeDefs: path.resolve(__dirname, 'schema.graphql'),
      resolvers,
      middlewares: [permissions],
      context: request => {
        return {
          ...request,
          prisma
        };
      }
    });
  })
  .then(server => {
    server.express.use(morgan('common'));
    server.express.use(cors());
    server.express.use(
      '/public',
      express.static(path.resolve(__dirname, 'public'))
    );
    server.express.use(routes);

    server.express.get('/recipes/:id', (req, res) => {
      const actualPage = '/recipe';
      nextApp.render(req, res, actualPage, req.params);
    });

    server.express.all('*', (req, res, next) => {
      if (['/playground', '/graphql'].includes(req.path)) {
        next();
        return;
      }
      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
