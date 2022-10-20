import mongoose from 'mongoose';

import v from './Validation.js';
import Product from '../product.js';

const cartSchema = {
  $$async: true,
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
    min: 0,
  },
  $$strict: 'remove',
};

const cartSchemaCheck = v.compile(cartSchema);

export default cartSchemaCheck;
