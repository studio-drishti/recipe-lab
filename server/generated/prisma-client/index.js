"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Recipe",
    embedded: false
  },
  {
    name: "Item",
    embedded: false
  },
  {
    name: "Step",
    embedded: false
  },
  {
    name: "Ingredient",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://prisma:4466`
});
exports.prisma = new exports.Prisma();
