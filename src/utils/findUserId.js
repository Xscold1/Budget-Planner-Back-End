const USER = require('../models/user-model')
const ERROR_MESSAGE = require('../constants/error-message')

module.exports =  findUserId = async (email) => {
  console.log(email)
  const getUserId = await USER.findOne({email:email});

  if(!getUserId) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)
  return getUserId._id
}
