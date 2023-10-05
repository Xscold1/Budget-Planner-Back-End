//serivces
const userService = require('../../service/user/user');
const {userSchema} = require('../../utils/validation')

//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

const REGISTER = async (req , res ) => {
  try {
    const {error, value } =  userSchema.validate(req.body)

    if (error) return res.json({...ERROR_MESSAGE.GENERAL_ERROR_JOI, message: error.message});

    const response = await userService.REGISTER(value);

    return res.json({...SUCCESS_MESSAGE.USER_SUCCESS_REGISTRATION, response});
      
  } catch (error) {
    if (error.code === 11000) return res.json(ERROR_MESSAGE.USER_ERROR_TAKEN)

    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const LOGIN = async (req , res ) => {
  try {
    // const {error, value } =  userSchema.validate(req.body)
    
    // if (error) return res.json({...ERROR_MESSAGE.GENERAL_ERROR_JOI, message: error.message});
    const response = await userService.LOGIN(req.body);  

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {

    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const BUDGET_PLANNER_ALLOCATOR = async (req , res) =>{
  try {
    const response = await userService.BUDGET_PLANNER_ALLOCATOR(req.body);

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {
    if (error.code === 11000) return res.json(ERROR_MESSAGE.USER_ERROR_TAKEN)
    console.log(error);
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

module.exports = {
  REGISTER,
  LOGIN,
  BUDGET_PLANNER_ALLOCATOR
}