const USER = require('../models/user-model')

const findUserId= async (email) => {
  console.log(email)
  const getUserId = USER.findOne({email: email})
  return getUserId._id;
}

module.exports = {findUserId};