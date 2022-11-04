import v from './Validation.js';

function returnSchema(optional = false) {
  return {
    title: {
      ...(optional && { optional: true }),
      type: 'string',
      min: 3,
      max: 255,
      empty: false,
      trim: true,
    },
    price: {
      ...(optional && { optional: true }),
      type: 'number',
      min: 1,
      empty: false,
    },
    description: {
      ...(optional && { optional: true }),
      type: 'string',
      required: true,
      min: 25,
      empty: false,
      trim: true,
    },
    image: {
      ...(optional && { optional: true }),
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
      ...(optional && { optional: true }),
      type: 'array',
      items: 'string',
    },
    status: {
      ...(optional && { optional: true }),
      type: 'enum',
      values: ['public', 'private', 'sold-out'],
      default: 'public',
    },
    $$strict: 'remove',
  };
}

const validateProductSchema = returnSchema();
const validateEditProductSchema = returnSchema(true);

const validateProductSchemaCheck = v.compile(validateProductSchema);
const validateEditProductSchemaCheck = v.compile(validateEditProductSchema);

export { validateProductSchemaCheck, validateEditProductSchemaCheck };
