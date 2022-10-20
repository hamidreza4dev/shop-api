import mongoose from 'mongoose';
import { validateProductSchemaCheck } from './secure/productSchema.js';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 25,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: [mongoose.Types.ObjectId],
      required: true,
      ref: 'Category',
    },
    status: {
      type: String,
      enum: ['public', 'private', 'sold-out'],
      required: true,
      lowercase: true,
      default: 'public',
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.statics.validateProduct = function (body) {
  return validateProductSchemaCheck(body);
};

const Product = mongoose.model('Product', productSchema);

export default Product;
