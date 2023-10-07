const STATUS_CODE = require('./status-code')
const STATUS = require('./status')


const successMessage = {
  //general success message
  GENERAL_SUCCESS_MESSAGE:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Success', 
  },

  USER_SUCCESS_ALLOCATION:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Budget Allocated Successfully', 
  },

  USER_SUCCESS_REGISTRATION: {
    status: STATUS.OK,
    statusCode: STATUS_CODE.CREATED,
    message: 'User Registration Successful',
  },

  USER_LOGOUT_SUCCESS: {
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Logout Successfully'
  },

  USER_LOGIN_SUCCESS: {
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Login Successfully'
  },

  FETCH_SUCCESS:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Fetched Successfully',
  },

  EXPENSE_ADDED_SUCCESS:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Expense Added Successfully',
  },
  
  UPDATE_NOTIFICATION:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Updated Successfully',
  },
  
}


module.exports = successMessage;