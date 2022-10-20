import mongoose from 'mongoose';
import categorySchemaCheck from './secure/categorySchema.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 24,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

categorySchema.statics.categoryValidation = function (body) {
  return categorySchemaCheck(body);
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
