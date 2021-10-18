/* eslint-disable no-param-reassign */
const Validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateSignupInput(data) {
  const errors = {};

  data.username = validText(data.username) ? data.username : '';
  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';
  data.password2 = validText(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.username, { min: 3, max: 12 })) {
    errors.username = 'Username must be between 3 and 12 characters';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }

  if (!Validator.isAlphanumeric(data.username)) {
    errors.username =
      'Username must only contain letters and numbers';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isStrongPassword(data.password)) {
    errors.password =
      'Field must contain at least one of each: uppercase letter, lowercase letter, number, & special character';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
