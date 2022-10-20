import v from './Validation.js';
import Category from '../category.js';

const userRegisterSchema = {
  $$async: true,
  name: {
    type: 'string',
    trim: true,
    empty: false,
    min: 2,
    max: 24,
    custom: async (name, errors) => {
      const category = await Category.findOne({ name });
      if (category) {
        errors.push({ type: 'unique', actual: name });
      }
      return name;
    },
  },
  $$strict: 'remove',
};

const userRegisterSchemaCheck = v.compile(userRegisterSchema);

export default userRegisterSchemaCheck;
