//serivces
const budgetService = require('../../service/budget/budget');

//constant
const ERROR_MESSAGE = require('../../constants/error-message')
const SUCCESS_MESSAGE = require('../../constants/success-message')

const BUDGET_PLANNER_ALLOCATOR = async (req , res) =>{
  try {
    const response = await budgetService.BUDGET_PLANNER_ALLOCATOR(req.body);

    return res.json({...SUCCESS_MESSAGE.USER_SUCCESS_ALLOCATION, response});

  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);

    return res.json(ERROR_MESSAGE.GENERAL_ERROR_REQUEST);
  }
}

const EXPENSE_ALLOCATOR = async (req, res) => {
  try {
    const response = await budgetService.EXPENSE_ALLOCATOR(req.body);

    return res.json({...SUCCESS_MESSAGE.USER_SUCCESS_ALLOCATION, response});
  } catch (error) {
    console.log(error);
    if(error.message) return res.json(error);
  }
}

const GET_BUDGET_PLANNER = async (req, res) =>{
  try {
    
  } catch (error) {
    
  }
}

const GET_EXPENSES = async (req, res) =>{
  try {
    
  } catch (error) {
    
  }
}


module.exports = {
  BUDGET_PLANNER_ALLOCATOR,
  EXPENSE_ALLOCATOR,
  GET_BUDGET_PLANNER,
  GET_EXPENSES
}