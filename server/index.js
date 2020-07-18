const path = require('path');
const next = require('next');
const nextConfig = require('../next.config.js');
const express = require('express');
const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const morgan = require('morgan');
const resolvers = require('./resolvers');
const permissions = require('./permissions');
const routes = require('./routes');

const prisma = new PrismaClient();
const { NODE_ENV } = process.env;

// Initialize the Next.js app
const nextApp = next({
  dir: './client',
  dev: NODE_ENV !== 'production',
  conf: nextConfig,
});

module.exports = nextApp
  .prepare()
  .then(() => {
    return new GraphQLServer({
      typeDefs: path.resolve(__dirname, 'schema/schema.graphql'),
      resolvers,
      middlewares: [permissions],
      context: (request) => {
        return {
          ...request,
          prisma,
        };
      },
    });
  })
  .then((server) => {
    server.express.use(morgan('common'));
    server.express.use(
      '/public',
      express.static(path.resolve(__dirname, 'public'))
    );
    server.express.use(routes);

    server.express.all('*', (req, res, next) => {
      if (['/playground', '/graphql'].includes(req.path)) return next();

      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    return server;
  })
  .catch((ex) => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
