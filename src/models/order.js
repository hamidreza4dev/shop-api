import mongoose from 'mongoose';

import orderSchemaCheck from './secure/orderSchema.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'progress', 'sent', 'received'],
      required: true,
      lowercase: true,
      default: 'pending',
      trim: true,
    },
  },
  { timestamps: true }
);

orderSchema.statics.orderValidation = function (body) {
  return orderSchemaCheck(body);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
