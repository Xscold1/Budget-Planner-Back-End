//constants
const ERROR_MESSAGE = require('../../constants/error-message')

//utils
const findUserId = require('../../utils/findUserId')

//model
const BUDGET = require('../../models/budget-model')
const EXPENSES = require('../../models/expense-model')

//library
const DecisionTree = require('decision-tree');
const fs = require('fs');
const csv = require('csv-parser')
const csvFilePath = (__dirname +"/Dataset.csv")

const ANALYZE = async(reqQuery)=>{
  try {

    const {budgetName,email,budgetType, year, month} = reqQuery

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
          Number(year)],
          $eq:[{
            "$month":"$createdAt"
          }, 
          Number(year)],
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

  const findBudget = await BUDGET.findOne({userId: {$in:[userId]}, budgetName: budgetName, budgetType: budgetType}, {totalBudget:1 , _id:0})

  const className = "habit"

  const features = ["budget","wants","needs","savings"]
  
  function predictFromCSV(csvFilePath, className, features) {
    return new Promise((resolve, reject) => {
      const data = [];

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          const dt = new DecisionTree(data, className, features);

          const predicted_class = dt.predict({
            budget: findBudget.totalBudget,
            wants: getMonthlyExpense.totalWants,
            needs: getMonthlyExpense.totalNeeds,
            savings: getMonthlyExpense.totalSavings
          });

          let result;

          if (predicted_class === "frugal") {
            result = "you are on budget, keep it up.";
          } else if (predicted_class === "moderate") {
            result = "you are balancing your budget well, but you can save more.";
          } else if (predicted_class === "squander") {
            result = "You are spending too much, cut some unnecessary expenses and start saving more.";
          }

          resolve(result);
        });
    });
  }

  const predictedResult = await predictFromCSV(csvFilePath, className, features);
  
  return predictedResult; // Return the result to the caller.
  } catch (error) {
    throw error
  }
}

module.exports = {
  ANALYZE,
}