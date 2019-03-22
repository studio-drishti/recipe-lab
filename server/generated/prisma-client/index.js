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
  },
  {
    name: "Modification",
    embedded: false
  },
  {
    name: "Sorting",
    embedded: true
  },
  {
    name: "Alteration",
    embedded: true
  },
  {
    name: "ItemAddition",
    embedded: true
  },
  {
    name: "StepAddition",
    embedded: true
  },
  {
    name: "IngredientAddition",
    embedded: true
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://prisma:4466`
});
exports.prisma = new exports.Prisma();
