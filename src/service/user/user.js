
//models
const USER = require('../../models/user-model');
const BUDGET = require('../../models/budget-model');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');
const SUCCESS_MESSAGE  = require('../../constants/success-message');

//modules
const bcrypt = require('bcrypt');
const saltRounds = 10

//utils
const checkEmail = require('../../utils/checkEmailIfExist')
const findUserId = require('../../utils/findUserId');
const generateToken = require('../../utils/generateToken');
const cloudinary = require('../../utils/cloudinary')

//library
const nodemailer = require("nodemailer");

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

    const getDefaultBudget = await BUDGET.findOne({userId:{$in:[findUser._id]}}, {budgetName:1, limit:1})

    const token = generateToken({email:findUser.email, userName:findUser.userName})

    if(!getDefaultBudget) {
      const payload ={
        data:{
          defaultBudget:null,
          token:token
        },
      }
  
      return payload;
    }

    const comparePassword = await bcrypt.compare(password, findUser.password)

    if (!comparePassword) throw(ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD)

    const payload ={
      data:{
        defaultBudget:getDefaultBudget.budgetName,
        token:token
      },
    }

    return payload;
  }catch (error) {
    throw error;
  }
}

const EDIT_PROFILE = async (reqBody, reqQuery, reqPath) => {
  try {
    const {email} = reqQuery
    
    const { password, newPassword, userName} = reqBody

    const uploadImage = await cloudinary.uploader.upload(reqPath)

    const userId = await findUserId(email)

    const findUser = await USER.findOne({email:email})

    if(!password) {

      const createUserPayload = {
        userName,
        imageUrl: uploadImage.url
      }
      
      const updateUser = await USER.findOneAndUpdate({userId:userId}, createUserPayload, {new:true})

      return updateUser

    }
      const comparePassword = await bcrypt.compare(password, findUser.password)

      if (!comparePassword) throw(ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD)

      const hashPassword = bcrypt.hashSync(newPassword,saltRounds)

      const createUserPayload = {
        userName,
        password: hashPassword,
        imageUrl: uploadImage.url
      }

      const updateUser = await USER.findOneAndUpdate({userId:userId}, createUserPayload, {new:true})

      return updateUser
    
  } catch (error) {
    throw error;
  }
}

const GET_USER = async (reqQuery) => {
  try {
    const {email} = reqQuery

    const userId = await findUserId(email)

    return USER.findById(userId)
  } catch (error) {
    throw error;
  }
}

const FORGOT_PASSWORD = async (reqBody) => {
  try {
    const {email} = reqBody;

    // Check if the email exists in the database
    const user = await USER.findOne({ email });

    if (!user)throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    // Generate a new password and save it to the database
    const newPassword = Math.random().toString(36).slice(-8);
    const hashPassword = bcrypt.hashSync(newPassword, 10)
    user.password = hashPassword;
    const changePassword = await user.save();

    // Send an email to the user with the new password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "budgetplanner321@gmail.com",
        pass: "qxifpotuuopnkylh",
      },
    });

    const mailOptions = {
      from: "budgetplanner321@gmail.com",
      to: email,
      subject: "Your Password Reset Request",
      text: `
      Dear ${user.userName}

      We have received your request to reset your password for your account. For your security, we're sending you the requested password information.

      Your new password is: ${newPassword}
      
      Please make sure to update your password as soon as you log in to your account.
      
      Sincerely,
      ${user.userName}      
      `,

      
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        throw error
      }else {
        console.log(info)
      }
    });

    return true
  } catch (error) {
      throw error
  }
};

module.exports = {
  REGISTER,
  LOGIN,
  EDIT_PROFILE,
  GET_USER,
  FORGOT_PASSWORD
 
}