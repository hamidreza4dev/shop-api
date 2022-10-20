import Validator from 'fastest-validator';

const v = new Validator({
  useNewCustomCheckerFunction: true,
  messages: {
    required: '{field} field is required',
    stringMin: '{field} should be {expected} chars at least',
    stringMax: '{field} can be {expected} chars at max',
    stringEmpty: '{field} field cannot be empty',
    equalField: '{field} field value must be equal to {expected} field value.',
    unique: 'the {field} field value already exists',
    enumValue:
      '{field} field value does not match any of the allowed values ({expected}).',
    id: '{field} is invalid id',
    objectID: '{field} is invalid id',
    existence: 'no {field} is exists with this id: ${actual}.',
  },
});

export default v;
