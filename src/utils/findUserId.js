const USER = require('../models/user-model')

module.exports =  findUserId = async (email) => {
  const getUserId = await USER.findOne({email:email});
  return getUserId._id
}
