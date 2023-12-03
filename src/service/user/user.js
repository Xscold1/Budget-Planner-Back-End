
//models
const USER = require('../../models/user-model');
const BUDGET = require('../../models/budget-model');
const TWOAUTH = require('../../models/two-factor-auth')

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

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
    const {email, password} = reqBody;
    const userEmail = email.toLowerCase();
    const findUser = await USER.findOne({ email: userEmail });

    if (!findUser || findUser === null) throw ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST;

    const getDefaultBudget = await BUDGET.find({ budgetOwner:email}, { budgetName: 1, limit: 1,startDate:1  }).sort({startDate: -1})
    console.log(getDefaultBudget[0])

    const comparePassword = await bcrypt.compare(password, findUser.password);

    if (!comparePassword) throw ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD;

    const token = generateToken({
      email: findUser.email,
      userName: findUser.userName,
      ifNewUser: findUser.ifNewUser,
      imageUrl: findUser.imageUrl,
      twoAuthRequired:findUser.twoAuthRequired
    });

    if(findUser.twoAuthRequired === false){
      if (!getDefaultBudget) {
        const payload = {
          data: {
            defaultBudget: null,
            token:token,
          },
        };

        return payload;
      }
      const payload = {
        data: {
          defaultBudget: getDefaultBudget[0],
          token: token,
        },
      };

      return payload;
    }

    // Generate a 6-digit random 2FA code
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000); // Generates a random code between 100000 and 999999

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "budgetplanner321@gmail.com",
        pass: "qxifpotuuopnkylh",
      },
    });

    const mailOptions = {
      from: 'YOUR_EMAIL',
      to: userEmail,
      subject: '2FA Code',
      text: `Your 2FA code is: ${twoFactorCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw ERROR_MESSAGE.EMAIL_SENDING_ERROR;
      } else {
        console.log('Code Sent');
      }
    });

    const checkIfTwoAuthExist = await TWOAUTH.findOne({email:userEmail})

    if(checkIfTwoAuthExist){
      await TWOAUTH.updateOne({email:userEmail}, {$push:{code:twoFactorCode}})
      return true
    }

    await TWOAUTH.create({email: userEmail, code: twoFactorCode})

    return true

  } catch (error) {
    throw error;
  }
};

const EDIT_PROFILE = async (reqBody, reqQuery, reqPath) => {
  try {
    const {email} = reqQuery
    
    const { password, newPassword, userName} = reqBody

    if(!reqPath){

      const findUser = await USER.findOne({email:email})
  
      if(!password) {
  
        const createUserPayload = {
          userName,
        }
        const updateUser = await USER.findOneAndUpdate({email:email}, createUserPayload, {new:true})
  
        console.log(updateUser)
  
        return updateUser
  
      }
        const comparePassword = await bcrypt.compare(password, findUser.password)
  
        if (!comparePassword) throw(ERROR_MESSAGE.USER_ERROR_INVALID_PASSWORD)
  
        const hashPassword = bcrypt.hashSync(newPassword,saltRounds)
  
        const createUserPayload = {
          userName,
          password: hashPassword,
        }
  
        const updateUser = await USER.findOneAndUpdate({email:email}, createUserPayload, {new:true})
  
        return updateUser
    }

    const uploadImage = await cloudinary.uploader.upload(reqPath.path)

    const findUser = await USER.findOne({email:email})

    if(!password) {

      const createUserPayload = {
        userName,
        imageUrl: uploadImage.url
      }
      
      const updateUser = await USER.findOneAndUpdate({email:email}, createUserPayload, {new:true})

      console.log(updateUser)

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

      const updateUser = await USER.findOneAndUpdate({email:email}, createUserPayload, {new:true})

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
    await user.save();

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

const VERIFY_2FA = async(reqBody,reqQuery) => {
  try {
    const {email} = reqQuery

    const {code} = reqBody

    const checkCode = await TWOAUTH.findOne({email: email, code: {$in:[code]}})

    if(!checkCode) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    const findUser = await USER.findOne({ email: email });

    const token = generateToken({
      email: findUser.email,
      userName: findUser.userName,
      ifNewUser: findUser.ifNewUser,
      imageUrl: findUser.imageUrl,
      twoAuthRequired:findUser.twoAuthRequired,
    });

    const getDefaultBudget = await BUDGET.findOne({ userId: { $in: [findUser._id] } }, { budgetName: 1, limit: 1 });

    if (!getDefaultBudget) {
      const payload = {
        data: {
          defaultBudget: null,
          token:token
        },
      };

      return payload;
    }
    const payload = {
      data: {
        defaultBudget: getDefaultBudget.budgetName,
        token: token,
      },
    };
    return payload;
  } catch (error) {
    throw error
  }
}

const TOGGLE_2FA = async (reqQuery) =>{
  try {

    const {email} = reqQuery
    const checkIf2fAIsEnabled = await USER.findOne({email:email})

    if(!checkIf2fAIsEnabled) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    if(checkIf2fAIsEnabled.twoAuthRequired === false) {
      await USER.updateOne({email:email}, {$set:{twoAuthRequired:true}})
      return true
    }

    await USER.updateOne({email:email}, {$set:{twoAuthRequired:false}})

    return false


  } catch (error) {
    throw error
  }
}

const LOGOUT = async (reqQuery) =>{
  try {
    const {email} = reqQuery

    const findTwoAuth = await TWOAUTH.findOneAndDelete({email:email})

    if(!findTwoAuth) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    return true
  } catch (error) {
    throw error
  }
}

module.exports = {
  REGISTER,
  LOGIN,
  EDIT_PROFILE,
  GET_USER,
  FORGOT_PASSWORD,
  VERIFY_2FA,
  TOGGLE_2FA,
  LOGOUT
}