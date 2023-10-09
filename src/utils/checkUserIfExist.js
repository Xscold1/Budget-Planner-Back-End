//model
const USER = require('../models/user-model')

//error message
const ERROR_MESSAGE = require('../constants/error-message')

const checkUserIfExist = (email) => {

  const checkUser = USER.findOne({email: email})
  if (!checkUser) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)
}

module.exports = {checkUserIfExist};