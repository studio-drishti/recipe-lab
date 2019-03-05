import mongoose from 'mongoose/browser';
const ObjectId = mongoose.Types.ObjectId;

export default () => new ObjectId().toString();
