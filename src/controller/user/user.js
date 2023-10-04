//serivces
const userService = require('../service/user/user');
const {userSchema} = require('../utils/validation')

const REGISTER = async (req , res ) => {
  try {
    const {userName, email, password} = req.body;
    try {
      await userSchema.validateAsync(req.body)
    }catch(err){
      
    }
  } catch (error) {
    
  }
}

const LOGIN = async (req , res ) => {
  try {
    
  } catch (error) {
    
  }
}

const BUDGET_PLANNER = async (req , res) =>{
  try {
    
  } catch (error) {
    
  }
}

module.exports = {
  REGISTER,
  LOGIN,
  BUDGET_PLANNER
}