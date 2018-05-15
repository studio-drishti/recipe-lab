const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
  },
  processing: {
    type: String,
  },
  toTaste: {
    type: Boolean,
    default: false,
  }
})

const StepSchema = new Schema({
  directions: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  ingredients: [IngredientSchema],
  // TODO: add images array
})

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // TODO: add related author model
  // TODO: Add source or sources (web / book / etc.)
  // TODO: Add fields for amount recipe yields (quantity, unit)
  // TODO: Add related tags field
  // TODO: Add featured image field
  time: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  steps: [StepSchema],
})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
