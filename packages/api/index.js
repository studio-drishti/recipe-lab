const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { addResolversToSchema } = require("@graphql-tools/schema");
const morgan = require("morgan");
const { applyMiddleware } = require("graphql-middleware");
const { PrismaClient } = require("./generated/client");
const resolvers = require("./resolvers");
const permissions = require("./permissions");

const prisma = new PrismaClient();

const server = new ApolloServer({
  schema: applyMiddleware(
    addResolversToSchema(
      loadSchemaSync(path.resolve(__dirname, "schema/schema.graphql"), {
        loaders: [new GraphQLFileLoader()],
      }),
      resolvers
    ),
    permissions
  ),
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) throw err;
  if (process.env.NODE_ENV === "development") {
    console.info(`ready - started api server on http://localhost:${PORT}`);
  } else {
    console.info(`API server is ready and listening on port ${PORT}`);
  }
});
