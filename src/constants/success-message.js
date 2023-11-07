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
  //debt

  DEBT_CREATED_SUCCESSFULLY:{
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Debt created successfully'
  },

  PAID_SUCCESSFULLY:{
    status: STATUS.OK,
    statusCode:STATUS_CODE.SUCCESS,
    message:'Pain Successfully'
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

  ANALYZE_SUCCESSFULLY:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Analyze successfully',
  },
  //nodemailers 

  SENT_NEW_PASSWORD_TO_EMAIL:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'New password is sent to your email address',
  },

  SENT_2FA_CODE_TO_EMAIL:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Your 2fa code was sent to your email address',
  },

  SUCCESS_2FA_ENABLED:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'Enable 2FA ',
  },

  SUCCESS_2FA_DISABLED:{
    status: STATUS.OK,
    statusCode: STATUS_CODE.SUCCESS,
    message: 'DISABLED 2FA',
  },
}


module.exports = successMessage;