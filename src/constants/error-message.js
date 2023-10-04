const STATUS = require('./status');
const STATUS_CODE = require('./status-codes');

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
  
}