const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const StepStringModSchema = new Schema({
//   stepId: Schema.Types.ObjectId,
//   field: 'directions|notes',
//   value: String,
// })

const AdditionalItemSchema = new Schema({
  // TODO: extend item schema
});

const AdditionalStepSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId
  }
  // TODO: extend step schema
});

const AdditionalIngredientSchema = new Schema({
  stepId: {
    type: Schema.Types.ObjectId
  }
  // TODO: extend ingredient schema
});

const ModificationSchema = new Schema({
  // author: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  sortItems: [Schema.Types.ObjectId],
  sortSteps: [
    {
      itemId: {
        type: Schema.Types.ObjectId
      },
      steps: [Schema.Types.ObjectId]
    }
  ],
  sortings: [
    {
      sourceId: Schema.Types.ObjectId,
      order: [Schema.Types.ObjectId]
    }
  ],
  alterations: [
    {
      sourceId: Schema.Types.ObjectId,
      field: String,
      value: String
    }
  ],
  removals: [
    {
      sourceId: Schema.Types.ObjectId
    }
  ],
  additionalItems: [AdditionalItemSchema],
  additionalSteps: [AdditionalStepSchema],
  additionalIngredients: [AdditionalIngredientSchema]
});

const Modification = mongoose.model('Modification', ModificationSchema);

module.exports = Modification;
