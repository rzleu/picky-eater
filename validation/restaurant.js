const Validator = require('validator');
const validText = require('./valid-text');

const validateRestaurantInput = (data) => {
  let errors = {};

  data.name = validText(data.name) ? data.name : '';
  data.address = validText(data.address) ? data.address : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Name field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateRestaurantInput;
