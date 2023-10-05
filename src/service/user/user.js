
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

const REGISTER = async (reqBody) => {
  try {
    const {email, password, userName} = reqBody

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
    const {email, password, userName} = reqBody

    const findUser = await USER.findOne({$or: [{email:email}, {userName:userName}]})

    if(!findUser || findUser === null) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    const comparePassword = bcrypt.compare(password,findUser.password)

    if (!comparePassword) throw(ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD)

    return findUser;
  }catch (error) {
    throw error;
  }
}

const BUDGET_PLANNER_ALLOCATOR = async (reqBody) =>{
  try {
    const {startDate, endDate, totalBudget,needs,wants,savings, budgetType} = reqBody

    const budgetPayload = {
      startDate,
      endDate,
      totalBudget,
      needs,
      wants,
      savings,
      budgetType
    }

    const budget = await BUDGET.create(budgetPayload)

    return budget;

  }catch (error) {
    throw error;
  }
}

module.exports = {
  REGISTER,
  LOGIN,
  BUDGET_PLANNER_ALLOCATOR
}