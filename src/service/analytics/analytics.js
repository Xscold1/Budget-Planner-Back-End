//constants
const ERROR_MESSAGE = require('../../constants/error-message')

//utils
const findUserId = require('../../utils/findUserId')
const formatExpenses = require('../../utils/formatExpenses')

//model
const BUDGET = require('../../models/budget-model')
const EXPENSES = require('../../models/expense-model')

const ANALYZE = async(reqQuery)=>{
  try {

    const {budgetName,email,budgetType, year} = reqQuery

    const userId = await findUserId(email)

    const getMonthlyExpense = await EXPENSES.aggregate([{
      $match:{
        userId:{
          $in:[userId]
        },
        budgetName:budgetName, 
        $expr:{
          $eq:[{
            "$year":"$createdAt"
          }, 
          Number(year)]
        }
      }
    },{
      $group:{
        _id:{
          month:{
            $month:"$createdAt"
          }
        },
        totalWants: {
          $sum: {
            $cond: {
              if: { $eq: ["$expenseType", "wants"] },
              then: "$amount",
              else: 0
            }
          }
        },
        totalNeeds: {
          $sum: {
            $cond: {
              if: { $eq: ["$expenseType", "needs"] },
              then: "$amount",
              else: 0
            }
          }
        },
        totalSavings: {
          $sum: {
            $cond: {
              if: { $eq: ["$expenseType", "savings"] },
              then: "$amount",
              else: 0
            }
          }
        }
      }
    }
  ])
    return getMonthlyExpense
  } catch (error) {
    throw error
  }
}

module.exports = {
  ANALYZE,
}