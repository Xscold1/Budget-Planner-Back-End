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

  DEBT_CREATED_SUCCESSFULLY:{
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Debt created successfully'
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

  FETCH_SUCCESS_NO_DATA:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'No data available',
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
  SENT_NEW_PASSWORD_TO_EMAIL:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'New password is sent to the email address',
  },
  
}


module.exports = successMessage;