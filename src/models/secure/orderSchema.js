import mongoose from 'mongoose';

import v from './Validation.js';
import Category from '../category.js';

import User from '../user.js';
import Product from '../product.js';

const orderSchema = {
  $$async: true,
  products: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        product: {
          type: 'objectID',
          ObjectID: mongoose.Types.ObjectId,
          trim: true,
          empty: false,
          custom: async (id, errors) => {
            const product = await Product.findOne({ _id: id });
            if (!product) {
              errors.push({ type: 'existence', actual: id });
            }
            return id;
          },
        },
        quantity: {
          type: 'number',
          integer: true,
          min: 1,
        },
      },
    },
  },
  status: {
    type: 'enum',
    values: ['pending', 'progress', 'sent', 'received'],
    default: 'pending',
  },
  $$strict: 'remove',
};

const orderSchemaCheck = v.compile(orderSchema);

export default orderSchemaCheck;
