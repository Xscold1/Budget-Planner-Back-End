const STATUS_CODE = require('./status-codes')
const STATUS = require('./status')


const successMessage = {
  //general success message
  GENERAL_SUCCESS_MESSAGE:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Success', 
  },

  USER_SUCCESS_REGISTRATION: {
    status: STATUS.OK,
    statusCode: STATUS_CODE.CREATED,
    message: 'User Registration Successful',
  },

  USER_SUCCESS_LOGOUT: {
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Logout Successfully'
  },

  UPDATE_NOTIFICATION:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Updated Successfully',
  },
  
}