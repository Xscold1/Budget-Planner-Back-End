//models
const BUDGET = require('../../models/budget-model');
const EXPENSES = require('../../models/expense-model');
const USER = require('../../models/user-model');

//constants
const ERROR_MESSAGE  = require('../../constants/error-message');

//utils
const findUserId = require('../../utils/findUserId');
const formatExpenses = require('../../utils/formatExpenses');
const getDateToday = require('../../utils/getDateToday');

const BUDGET_PLANNER_ALLOCATOR = async (reqBody, reqQuery) =>{
  try {

    const {email} = reqQuery
    const {startDate, totalBudget,needs,wants,savings, budgetType, budgetName, iconId} = reqBody

    const checkIfNewUser = await USER.findOne({email: email})

    if(checkIfNewUser.ifNewUser === true) await USER.updateOne({email: email}, {$set: {ifNewUser:false}})

    const userId = checkIfNewUser._id

    const budgetPayload = {
      startDate,
      budgetName,
      totalBudget,
      remainingBudget: totalBudget,
      needs,
      wants,
      savings,
      budgetType,
      iconId,
      userId,
    }

    const budget = await BUDGET.create(budgetPayload)

    return budget;

  }catch (error) {
    throw error;
  }
}

const EXPENSE_ALLOCATOR = async (reqBody, reqQuery) => {
  try {

    const {budgetName, email} = reqQuery
    const {amount, name, note, type, category} = reqBody;

    const userId = await findUserId(email)

    const expensePayload = {
      amount,
      name,
      category,
      note,
      budgetName,
      expenseType:type,
      userId,
      createdAt: getDateToday()
    }

    const newExpense = await EXPENSES.create(expensePayload)
    
    // Update Budget if new expense was added
    const curBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName})

    const expense = Number(curBudget.totalExpenses) + Number(amount);
    
    await BUDGET.findOneAndUpdate({userId: {$in:[userId]}}, {
      totalExpenses: expense,
      remainingBudget: Number(curBudget.totalBudget) - Number(expense),
    })
    
    return newExpense;
  } catch (error) {
    throw error;
  }
}

const ADD_USER = async (reqBody, reqQuery) =>{
  try {
    const {userEmail} = reqBody

    const {email, budgetName} = reqQuery

    const userId = await findUserId(email)

    const findUser = await USER.findOne({email: userEmail})

    if(!findUser) throw (ERROR_MESSAGE.USER_ERROR_DO_NOT_EXIST)

    const addUserToBudget = await BUDGET.findOneAndUpdate({budgetName:budgetName, userId: {$in:[userId]}}, {$push: {userId: findUser._id}}, {new: true})

    return addUserToBudget
  } catch (error) {
    throw error;
  }
}

const EDIT_BUDGET_PLANNER = async (reqBody, reqQuery) =>{
  try {

    const {email, budgetName} = reqQuery

    const {totalBudget, editBudgetName} = reqBody

    const userId = await findUserId(email)

    const findBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName: budgetName})

    await EXPENSES.updateMany({userId: userId, budgetName: budgetName}, {budgetName: editBudgetName})
    
    const payLoad = {
      budgetName:editBudgetName,
      totalBudget,
      remainingBudget: totalBudget - findBudget.totalExpenses
    }
    
    const updateBudget = await BUDGET.findOneAndUpdate({userId:{$in:[userId]}, budgetName:budgetName}, payLoad , {new:true})

    return updateBudget;
  } catch (error) {
    throw error;
  }
}

const EDIT_CATEGORY_PLANNER = async (reqBody, reqQuery) =>{
  try {
    const {email, budgetName} = reqQuery

    const findUser = await USER.findOne({email: email})

    const userId = findUser._id

    const updateBudgetCategory = await BUDGET.updateOne({userId:{$in:[userId]}, budgetName:budgetName}, reqBody ,{new:true})

    return updateBudgetCategory;

  } catch (error) {
    throw error;
  }
}


const GET_BUDGET_PLANNER = async (reqQuery) => {
  try {
    const {email, budgetName} = reqQuery

    const findUser = await USER.findOne({email: email})
    
    const userId = findUser._id;

    const findBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName}, { '_id': false})

    return findBudget;
  } catch (error) {
    throw error;
  }
}

const GET_CATEGORY_PLANNER = async (reqQuery) =>{
  try {
    const {email, type, budgetName} = reqQuery

    const userId = await findUserId(email)

    const findBudgetCategory = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName}).distinct(type)
    return findBudgetCategory
  } catch (error) {
    throw error;
  }
}

const GET_TRANSACTION = async (reqQuery) =>{
  try {
    const {email, type, budgetName} = reqQuery

    const userId = await findUserId(email)

      if(type === 'monthly'){
        const {month, year} = reqQuery
        const getExpenses = await EXPENSES.find({userId:{$in:[userId]}, budgetName:budgetName , $expr:{$and:[{$eq:[{"$month":"$createdAt"}, month]} ,{$eq:[{"$year":"$createdAt"}, year]}]}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
      
    }else if (type === 'yearly'){
        const {year} = reqQuery
        const getExpenses = await EXPENSES.find({userId:{$in:[userId]} ,budgetName:budgetName, $expr:{$and:[{$eq:[{"$year":"$createdAt"}, year]}]}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
    }else if (type === 'weekly'){
      const {startDate, endDate} = reqQuery

      const getExpenses = await EXPENSES.find({userId:{$in:[userId]},budgetName:budgetName, createdAt:{$lte:endDate, $gte:startDate}}).sort({createdAt: -1})

        let sum = 0

        getExpenses.map((amount) => {
          sum += Number(amount.amount)
        })

      return {
        getExpenses,
        sum
      }
    }else if (type === 'daily'){
      const { day } = reqQuery

      const endDate = day.concat("T23:59:59.000+00:00")
      const startDate = day.concat("T00:00:00.000+00:00")
      const getExpenses = await EXPENSES.find({userId:{$in:[userId]} ,budgetName:budgetName, createdAt:{$lte:endDate, $gte:startDate}})

      let sum = 0

      getExpenses.map((amount) => {
        sum += Number(amount.amount)
      })
      
      return {
        getExpenses,
        totalSum:sum
      } 
    }else {
      const getExpenses = await EXPENSES.find({userId:{$in:[userId]}})
      return getExpenses
    }
  } catch (error) {
    throw error;
  }
}

const GET_INSIGHT = async (reqQuery) =>{
  try {
    const {email, type, year, month, startDate, endDate, budgetName} = reqQuery

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
      const getExpenses = await EXPENSES.aggregate([{$match:{userId:{$in:[userId]}, budgetName:budgetName, $expr:{$eq:[{"$month":"$createdAt"}, Number(month)], $eq:[{"$year":"$createdAt"}, Number(year)]}}}, {$group:{_id:{month:{$month:"$createdAt"}},expenses_this_month:{
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
        let totalExpenses = formatExpenses.formatExpenses(getExpenses.expenses_this_month)
        let sortExpenses = totalExpenses.sort((amount1, amount2) => {
          return amount2.amount - amount1.amount;
        })
        return {
          month: monthsConversion[getExpenses._id.month],
          expenses: sortExpenses.slice(0, 3)
        }
      });
    return categories
  }else if (type === 'yearly'){
    const getExpenses = await EXPENSES.aggregate([{$match:{userId:{$in:[userId]}, budgetName:budgetName, $expr:{$eq:[{"$year":"$createdAt"}, Number(year)]}}}, {$group:{_id:{year:{$year:"$createdAt"}},expenses_this_year:{
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
    let sortExpenses = totalExpenses.sort((amount1, amount2) => {
      return amount2.amount - amount1.amount;
    })
    return {
      year: getExpenses._id.year,
      expenses: sortExpenses.slice(0, 3)
    }
  });
    return categories
  }else if (type === 'weekly'){

    const getExpenses = await EXPENSES.aggregate([{$match:{userId:{$in:[userId]},budgetName:budgetName, $expr:{createdAt:{$gte:["$createdAt", startDate]}},  $expr:{createdAt:{$lte:["$createdAt", endDate]}}}}, {$group:{_id:{week:{$week:"$createdAt"}},expenses_this_week:{
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
      let sortExpenses = totalExpenses.sort((amount1, amount2) => {
        return amount2.amount - amount1.amount;
      })
      return {
        weekly: getExpenses._id.week,
        expenses: sortExpenses.slice(0, 3)
      }
    });
  return categories
  }
  } catch (error) {
    throw error;
  }
}

const GET_ALL_BUDGET_NAME = async (reqQuery) => {
  try {
    const {email} = reqQuery
    const userId = await findUserId(email)

    const findBudgetName = BUDGET.find({userId: {$in:[userId]}}, {budgetName:1, budgetType:1, _id:0})

    return findBudgetName
  } catch (error) {
    throw error    
  }
}

const GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT = async (reqQuery) => {
  try {
    const {email, budgetName} = reqQuery

    const userId = await findUserId(email)

    const findUserAlongWithBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName:budgetName})

    const userNames = []

    for (let user of findUserAlongWithBudget.userId){
      let getUserName = await USER.findOne({_id: user})
      userNames.push(getUserName.userName)
    }
    return userNames
  } catch (error) {
    throw error
  }
}
module.exports = {
  BUDGET_PLANNER_ALLOCATOR, 
  EXPENSE_ALLOCATOR,
  ADD_USER,
  EDIT_BUDGET_PLANNER,
  EDIT_CATEGORY_PLANNER,
  GET_BUDGET_PLANNER,
  GET_CATEGORY_PLANNER,
  GET_TRANSACTION,
  GET_INSIGHT,
  GET_ALL_BUDGET_NAME,
  GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT
}