//models
const BUDGET = require('../../models/budget-model');
const EXPENSES = require('../../models/expense-model');
const USER = require('../../models/user-model');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

//utils
const findUserId = require('../../utils/findUser');
const formatExpenses = require('../../utils/formatExpenses');

const BUDGET_PLANNER_ALLOCATOR = async (reqBody) =>{
  try {
    const {startDate, totalBudget,needs,wants,savings, budgetType, email} = reqBody

    const findUser = await USER.findOne({email: email})

    if(findUser.ifBudgetAllocationExists === true) throw (ERROR_MESSAGE.BUDGET_ALREADY_ALLOCATED)

    const userId = findUser._id

    const budgetPayload = {
      startDate,
      totalBudget,
      remainingBudget: totalBudget,
      needs,
      wants,
      savings,
      budgetType,
      userId
    }

    const budget = await BUDGET.create(budgetPayload)

    await USER.updateOne({email: email}, {$set: {ifBudgetAllocationExists:true}}, {new : true})

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

    const findBudget = await BUDGET.findOne({userId: userId})
    const payLoad = {
      totalBudget: reqBody,
      remainingBudget: reqBody - findBudget.remainingBudget
    }
    
    const updateBudgetCategory = await BUDGET.updateOne({userId:userId}, payLoad ,{new:true})

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

    const monthsConversion = {
      '1': "January",
      '2': "February",
      '3': "March",
      '4': "April",
      '5': "May",
      '6': "June",
      '7': "July",
      '8': "August",
      '9': "September",
      '10': "October",
      '11': "November",
      '12': "December"
    };

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

      const categories = getExpenses.map((getExpenses) => {
        const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_month)
        return {
          month: monthsConversion[getExpenses._id.month],
          expenses_this_month: getExpenses.expenses_this_month,
          totalExpenses: totalExpenses
        }
      });
      return categories;
      
    }else if (type === 'yearly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId, }}, {$group:{_id:{year:{$year:"$createdAt"}},expenses_this_year:{
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
    const categories = getExpenses.map((getExpenses) => {
      const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_year)
      return {
        year: monthsConversion[getExpenses._id.year],
        expenses_this_year: getExpenses.expenses_this_year,
        totalExpenses: totalExpenses
      }
    });
    return categories;
    }else if (type === 'weekly'){
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId}}, {$group:{_id:{week:{$week:"$createdAt"}},expenses_this_week:{
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
    const categories = getExpenses.map((getExpenses) => {
      const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_week)
      return {
        year: monthsConversion[getExpenses._id.week],
        expenses_this_week: getExpenses.expenses_this_week,
        totalExpenses: totalExpenses
      }
    });
    return categories;
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

    const monthsConversion = {
      '1': "January",
      '2': "February",
      '3': "March",
      '4': "April",
      '5': "May",
      '6': "June",
      '7': "July",
      '8': "August",
      '9': "September",
      '10': "October",
      '11': "November",
      '12': "December"
    };

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
      const categories = getExpenses.map((getExpenses) => {
        const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_month)
        return {
          month: monthsConversion[getExpenses._id.month],
          expenses: totalExpenses
        }
      });
    return categories
  }else if (type === 'yearly'){
    const getExpenses = await EXPENSES.aggregate([{$match:{userId:userId, }}, {$group:{_id:{year:{$year:"$createdAt"}},expenses_this_year:{
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
  const categories = getExpenses.map((getExpenses) => {
    const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_year)
    return {
      year: getExpenses._id.year,
      expenses: totalExpenses
    }
  });
    return categories
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
    const categories = getExpenses.map((getExpenses) => {
      const totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_week)
      return {
        weekly: getExpenses._id.week,
        expenses: totalExpenses
      }
    });
  return categories
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