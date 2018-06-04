const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Possible structure:
// {
//   _id: '423u4-09uaiuja;osdf',
//   recipe: '3827890snjuerioasdfg',
//   modified: 'recipe|item|step|ingredient',
//   modifiedId: '12345135234636734',
//   type: 'sort|name|description|etc',
//   value: mixed,
// }

const ModSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  },
  modifiedId: {
    type: Schema.Types.ObjectId,
  },
})
