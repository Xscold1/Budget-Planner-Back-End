
//models
const USER = require('../../models/user-model');
const BUDGET = require('../../models/budget-model');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

//modules
const bcrypt = require('bcrypt');
const saltRounds = 10

//utils
const {toLower} = require('../../utils/lowerCase');
const checkEmail = require('../../utils/checkEmailIfExist')

const REGISTER = async (reqBody) => {
  try {
    const {email, password, userName} = reqBody

    checkEmail.checkEmailIfExist(email)

    const hashPassword = bcrypt.hashSync(password,saltRounds)

    const userPayload = {
      email:email,
      userName:userName,
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
    const {email, password, userName} = reqBody

    const findUser = await USER.findOne({email:email})

    const userId = findUser._id

    if(!findUser || findUser === null) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    const comparePassword = await bcrypt.compare(password, findUser.password)

    const checkBudgetIfExist = await BUDGET.findOne({userId:userId})

    if(checkBudgetIfExist) {
      await USER.findOneAndUpdate({email:email}, {$set:{ifBudgetAllocationExists:"true"}} , {new:true})
    }

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