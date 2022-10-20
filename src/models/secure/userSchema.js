import v from './Validation.js';
import User from '../user.js';

const userRegisterSchema = {
  $$async: true,
  fullname: {
    type: 'string',
    empty: false,
    trim: true,
    min: 2,
    max: 36,
  },
  email: {
    type: 'email',
    empty: false,
    normalize: true,
    custom: async (email, errors) => {
      const user = await User.findOne({ email });
      if (user) {
        errors.push({ type: 'unique', actual: email });
      }
      return email;
    },
  },
  password: {
    type: 'string',
    empty: false,
    trim: true,
    min: 8,
    max: 36,
  },
  confirmPassword: {
    type: 'equal',
    field: 'password',
  },
  $$strict: 'remove',
};

const userRegisterSchemaCheck = v.compile(userRegisterSchema);

export default userRegisterSchemaCheck;
