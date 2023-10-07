//models
const BUDGET = require('../../models/budget-model');
const EXPENSES = require('../../models/expense-model');
const USER = require('../../models/user-model');

const BUDGET_PLANNER_ALLOCATOR = async (reqBody) =>{
  try {
    const {startDate, endDate, totalBudget,needs,wants,savings, budgetType, email} = reqBody

    const findUser = await USER.findOne({email:email})

    const budgetPayload = {
      startDate,
      endDate,
      totalBudget,
      needs,
      wants,
      savings,
      budgetType,
      userId:findUser._id
    }

    const budget = await BUDGET.create(budgetPayload)

    return budget;

  }catch (error) {
    throw error;
  }
}

const EXPENSE_ALLOCATOR = async (reqBody) => {
  try {
    const {amount, name, note, email, type} = reqBody;

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id
    
    const expensePayload = {
      amount,
      name,
      note,
      expenseType:type,
      userId
    }
    const newExpense = await EXPENSES.create(expensePayload)

    return newExpense;
  } catch (error) {
    throw error;
  }
}

const GET_BUDGET_PLANNER = async (reqBody) => {
  try {
    
  } catch (error) {
    
  }
}

const GET_EXPENSES = async (reqBody) => {
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