//models
const BUDGET = require('../../models/budget-model');
const EXPENSES = require('../../models/expense-model');
const USER = require('../../models/user-model');

//utils
const findUserId = require('../../utils/findUser');

const BUDGET_PLANNER_ALLOCATOR = async (reqBody) =>{
  try {
    const {startDate, endDate, totalBudget,needs,wants,savings, budgetType, email} = reqBody

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id

    const budgetPayload = {
      startDate,
      endDate,
      totalBudget,
      needs,
      wants,
      savings,
      budgetType,
      userId
    }

    const budget = await BUDGET.create(budgetPayload)

    return budget;

  }catch (error) {
    throw error;
  }
}

const EXPENSE_ALLOCATOR = async (reqBody) => {
  try {
    const {amount, name, note, email, type, category} = reqBody;

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id
    
    const expensePayload = {
      amount,
      name,
      category,
      note,
      expenseType:type,
      userId
    }

    const newExpense = await EXPENSES.create(expensePayload)
    
    // Update Budget if new expense was added
    const curBudget = await BUDGET.findOne({userId: userId})

    const expense = Number(curBudget.totalExpenses) + Number(amount);
    
    await BUDGET.findOneAndUpdate({userId: userId}, {
      totalExpenses: expense,
      remainingBudget: Number(curBudget.totalBudget) - Number(expense),
    })
    
    return newExpense;
  } catch (error) {
    throw error;
  }
}

const GET_BUDGET_PLANNER = async (reqQuery) => {
  try {
    const {email} = reqQuery

    const findUser = await USER.findOne({email: email})
    
    const userId = findUser._id;

    const findBudget = await BUDGET.findOne({userId: userId}, { '_id': false})

    return findBudget;
  } catch (error) {
    throw error;
  }
}


const EDIT_BUDGET_PLANNER = async (reqBody, reqQuery) =>{
  try {

    const {email} = reqQuery

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id

    const updateBudget = await BUDGET.findOneAndUpdate({userId:userId}, reqBody , {new:true})

    return updateBudget;
  } catch (error) {
    throw error;
  }
}

const EDIT_CATEGORY_PLANNER = async (reqBody, reqQuery) =>{
  try {
    const {email} = reqQuery

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id
    
    const updateBudgetCategory = await BUDGET.updateOne({userId:userId}, reqBody ,{new:true})

    return updateBudgetCategory;

  } catch (error) {
    throw error;
  }
}

const GET_CATEGORY_PLANNER = async (reqQuery) =>{
  try {
    const {email, type} = reqQuery

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id

    const findBudgetCategory = await BUDGET.findOne({userId: userId}).distinct(type)
    return findBudgetCategory
  } catch (error) {
    throw error;
  }
}

const GET_TRANSACTION = async (reqQuery) =>{
  try {
    const {email, type} = reqQuery

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id;

    if(type === 'monthly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId,}}, {$group:{_id:{month:{$month:"$createdAt"}},expenses_this_month:{
            $push: {
              category:"$category",
              name:"$name",
              note:"$note",
              type:"$expenseType",
              amount:"$amount",
              createdAt:"$createdAt"
            }
          }
        }
      }
    ])
      return getExpenses
    }else if (type === 'yearly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId,}}, {$group:{_id:{year:{$year:"$createdAt"}},expenses_this_year:{
            $push: {
              category:"$category",
              name:"$name",
              note:"$note",
              type:"$expenseType",
              amount:"$amount",
              createdAt:"$createdAt"
            }
          }
        }
      }
    ])
      return getExpenses
    }else if (type === 'weekly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId,}}, {$group:{_id:{week:{$week:"$createdAt"}},expenses_this_week:{
            $push: {
              category:"$category",
              name:"$name",
              note:"$note",
              type:"$expenseType",
              amount:"$amount",
              createdAt:"$createdAt"
            }
          }
        }
      }
    ])
      return getExpenses
    }else {
      const getExpenses = await EXPENSES.find({userId:userId})
      return getExpenses
    }
    
  } catch (error) {
    throw error;
  }
}

const GET_INSIGHT = async (reqQuery) =>{
  try {
    const {email, type} = reqQuery

    const findUser = await USER.findOne({email: email})
    const userId = findUser._id;

    if(type === 'monthly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId,}}, {$group:{_id:{month:{$month:"$createdAt"}},expenses_this_month:{
            $push: {
              category:"$category",
              name:"$name",
              note:"$note",
              type:"$expenseType",
              amount:"$amount",
              createdAt:"$createdAt",
            }
          }
        }
      }
    ])
    const mapExpenses = getExpenses.map(data=>{
      const mapSubArray = data.expenses_this_month.map(subData=>{
        const dateContainer = {}
      })
    })
    return getExpenses
  }

  } catch (error) {
    throw error;
  }
}
module.exports = {
  BUDGET_PLANNER_ALLOCATOR, 
  EXPENSE_ALLOCATOR,
  GET_BUDGET_PLANNER,
  GET_CATEGORY_PLANNER,
  GET_TRANSACTION,
  EDIT_BUDGET_PLANNER,
  EDIT_CATEGORY_PLANNER,
  GET_INSIGHT
}