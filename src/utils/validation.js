const joi = require('joi');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const userSchema = joi.object({

  userName: joi.string().min(4).max(16).required()
    .messages({
      "string.empty": "Username should not be empty",
      "string.min": "Username must have at least 4 characters",
      "string.max": "Username should not have more than 16 characters"
    }),

  email: joi.string().email().required()
    .messages({
      "string.email": "Must be a valid email address",
      "string.empty": "Email address should not be empty"
    }),

  password: joi.string().min(8).pattern(PASSWORD_REGEX, 'password').required().messages({
    "string.min": "Password must have at least 8 characters",
    "string.empty": "Password must not be empty",
    "string.pattern.name": "Password must have at least 8 characters, no white spaces and contain at least one of the following: uppercase letters, lowercase letters, numbers and symbols"
  }),

});

module.exports = {
  userSchema
};