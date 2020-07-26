const path = require('path');
const next = require('next');
const express = require('express');
const nextConfig = require('../next.config.js');
const { ApolloServer } = require('apollo-server-express');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { PrismaClient } = require('@prisma/client');
const morgan = require('morgan');
const resolvers = require('./resolvers');
// const permissions = require('./permissions');
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
    const schema = addResolversToSchema(
      loadSchemaSync(path.resolve(__dirname, 'schema/schema.graphql'), {
        loaders: [new GraphQLFileLoader()],
      }),
      resolvers
    );
    return new ApolloServer({
      schema,
      // middlewares: [permissions],
      context: (request) => {
        return {
          ...request,
          prisma,
        };
      },
    });
  })
  .then((apolloServer) => {
    const app = express();
    app.use(morgan('common'));
    app.use('/public', express.static(path.resolve(__dirname, 'public')));
    app.use(routes);
    apolloServer.applyMiddleware({ app });
    app.all('*', nextApp.getRequestHandler());
    return app;
  })
  .catch((ex) => {
    console.error(ex.stack);
    throw 'Could not set up express server';
  });
