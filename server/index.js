const path = require('path');
const next = require('next');
const nextConfig = require('../next.config.js');
const express = require('express');
const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const resolvers = require('./resolvers');
const permissions = require('./permissions');
const morgan = require('morgan');
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const routes = require('./routes');

const { NODE_ENV } = process.env;

// Initialize the Next.js app
const nextApp = next({
  dir: './client',
  dev: NODE_ENV !== 'production',
  conf: nextConfig
});

module.exports = nextApp
  .prepare()
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
      if (['/playground', '/graphql'].includes(req.path)) return next();

      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
