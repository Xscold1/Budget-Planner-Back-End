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

    const {error, value } =  userSchema.validate(req.body)

    const response = await userService.LOGIN(value); 

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {

    console.log(error);
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const EDIT_PROFILE = async (req , res ) => {
  try {

    const response = await userService.EDIT_PROFILE(req.body, req.query); 

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const GET_USER = async (req , res ) => {
  try {

    const response = await userService.GET_USER(req.body); 

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const FORGOT_PASSWORD = async (req , res ) => {
  try {

    const response = await userService.FORGOT_PASSWORD(req.body); 

    return res.json({...SUCCESS_MESSAGE.USER_LOGIN_SUCCESS, response});

  } catch (error) {
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

module.exports = {
  REGISTER,
  LOGIN,
  EDIT_PROFILE,
  GET_USER,
  FORGOT_PASSWORD
}