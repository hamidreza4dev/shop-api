import v from './Validation.js';

const validateProductSchema = {
  title: {
    type: 'string',
    min: 3,
    max: 255,
    empty: false,
    trim: true,
  },
  description: {
    type: 'string',
    required: true,
    min: 25,
    empty: false,
    trim: true,
  },
  image: {
    type: 'object',
    props: {
      originalname: {
        type: 'string',
        required: true,
        empty: false,
        min: 3,
        max: 100,
      },
      mimetype: {
        type: 'enum',
        values: ['image/png', 'image/jpeg', 'image/jpg'],
      },
      size: {
        type: 'number',
        positive: true,
        integer: true,
        max: 2 * 1024 * 1000,
      },
    },
  },
  category: {
    type: 'array',
    items: 'string',
  },
  status: {
    type: 'enum',
    values: ['public', 'private', 'sold-out'],
    default: 'public',
  },
  $$strict: 'remove',
};

const validateProductSchemaCheck = v.compile(validateProductSchema);

export { validateProductSchemaCheck };
