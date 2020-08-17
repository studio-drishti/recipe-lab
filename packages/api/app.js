const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const morgan = require("morgan");
const { applyMiddleware } = require("graphql-middleware");
const { PrismaClient } = require("./generated/client");
const resolvers = require("./resolvers");
const permissions = require("./permissions");
const typeDefs = require("./schema");

const prisma = new PrismaClient();

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  permissions
);

const server = new ApolloServer({
  schema,
  context: (request) => {
    return {
      ...request,
      prisma,
    };
  },
});

const app = express();
app.use(morgan("common"));
app.use("/public", express.static(path.resolve(__dirname, "public")));

server.applyMiddleware({ app });

module.exports = app;
