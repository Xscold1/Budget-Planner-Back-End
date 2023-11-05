const STATUS = require('./status');
const STATUS_CODE = require('./status-code');

const errorMessage = {
  // General Error Messages
  GENERAL_ERROR_1001: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.FAILED,
    message: 'Something went wrong!',
  },
  GENERAL_ERROR_JOI: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.VALIDATION_ERROR,
  },

  // User Error Messages
  USER_ERROR_CREATE: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.FAILED,
    message: 'Failed to create user.',
  },

  USER_ERROR_DO_NOT_EXIST:{
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.CONFLICT,
    message: 'User does not exist.',
  },

  USER_ERROR_TAKEN: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.CONFLICT,
    message: 'Email or User Name already exist.',
  },

  USER_ERROR_EMAIL_TAKEN: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.CONFLICT,
    message: 'Email already exist.',
  },

  USER_ERROR_USERNAME_TAKEN: {
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.CONFLICT,
    message: 'Email already exist.',
  },

  USER_ERROR_INVALID_PASSWORD:{
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.VALIDATION_ERROR,
    message: 'Invalid password.',
  },
  //budget error
  BUDGET_ALREADY_ALLOCATED:{
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.FAILED,
    message: 'User already allocated budget.',
  },

  USER_ALREADY_EXIST_IN_THE_BUDGET:{
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.FAILED,
    message: 'User already exists in the budget.',
  },
  

  //debt error
  DEBT_ALEADY_EXIST:{
    status: STATUS.FAILED,
    statusCode: STATUS_CODE.FAILED,
    message: 'You still have an outstanding balance to this person',
  }
}


module.exports = errorMessage;