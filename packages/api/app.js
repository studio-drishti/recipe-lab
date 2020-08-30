const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const { PrismaClient } = require("./generated/client");
const resolvers = require("./resolvers");
const permissions = require("./permissions");
const typeDefs = require("./schema");

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(schema, permissions);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: (request) => {
    return {
      ...request,
      prisma,
    };
  },
});

const app = express();

app.use("/public", express.static(path.resolve(__dirname, "public")));

server.applyMiddleware({ app });

module.exports = app;
