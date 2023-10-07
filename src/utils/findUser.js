const USER = require('../models/user-model')

const findUser = async (email) => {
  console.log(email)
  const getUserId = USER.findOne(email)
  return getUserId._id;
}

module.exports = findUser;