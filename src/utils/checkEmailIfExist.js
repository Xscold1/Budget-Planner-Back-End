//model
const USER = require('../models/user-model')

//error message
const ERROR_MESSAGE = require('../constants/error-message')

const checkEmailIfExist = (email) => {
  console.log(email)
  
  const checkEmailIfExist = USER.findOne({email: email})
  
  if (!checkEmailIfExist) throw (ERROR_MESSAGE.USER_ERROR_EMAIL_TAKEN)

  return checkEmailIfExist;
}

module.exports = {checkEmailIfExist};