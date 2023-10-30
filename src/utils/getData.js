const EXPENSES = require('../models/expense-model');

const GET_DATA = async (userId) =>{
  try {
    const getData = await EXPENSES.find({userId:userId})

    let totalNeeds = 0, totalWants = 0, totalSavings = 0



    getData.map((budgets) =>{
      if(budgets.expenseType === "wants") totalNeeds += budgets.amount
      if(budgets.expenseType === "needs") totalWants += budgets.amount
      if(budgets.expenseType === "savings") totalSavings += budgets.amount
    })

    return data = {
      totalNeeds: totalNeeds,
      totalWants: totalWants,
      totalSavings: totalSavings
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = GET_DATA