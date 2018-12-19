import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export default () => new ObjectId().toString();
