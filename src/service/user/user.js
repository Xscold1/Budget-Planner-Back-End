
//models
const USER = require('../../models/user-model');
const BUDGET = require('../../models/budget-model');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

//modules
const bcrypt = require('bcrypt');
const saltRounds = 10

//utils
const checkEmail = require('../../utils/checkEmailIfExist')
const findUser = require('../../utils/findUser')

const REGISTER = async (reqBody) => {
  try {
    const {email, password, userName} = reqBody

    checkEmail.checkEmailIfExist(email)

    const hashPassword = bcrypt.hashSync(password,saltRounds)

    const userPayload = {
      email:email.toLowerCase(),
      userName:userName.toLowerCase(),
      password:hashPassword
    }
    const user = await USER.create(userPayload)

    return user;
  } catch (error) {
    throw error;
  }
}

const LOGIN = async (reqBody) => {
  try {
    const {email, password} = reqBody

    const userEmail = email.toLowerCase()

    const findUser = await USER.findOne({email:userEmail})

    if(!findUser || findUser === null) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    const comparePassword = await bcrypt.compare(password, findUser.password)

    if (!comparePassword) throw(ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD)

    return findUser;
  }catch (error) {
    throw error;
  }
}



module.exports = {
  REGISTER,
  LOGIN,
 
}