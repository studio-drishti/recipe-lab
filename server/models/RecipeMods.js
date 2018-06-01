const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const StepModSchema = new Schema({
  step: {
    type: Schema.Types.ObjectId,
    // ref: 'Recipe',
  },
})
