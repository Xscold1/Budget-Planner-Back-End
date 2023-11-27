//constants
const ERROR_MESSAGE = require('../../constants/error-message')

//utils
const findUserId = require('../../utils/findUserId')

//model
const BUDGET = require('../../models/budget-model')
const EXPENSES = require('../../models/expense-model')

//library
const regression = require('regression')

const ANALYZE = async (reqQuery) =>{
  try {

    const {email, budgetName} = reqQuery

    const getExpenses = await EXPENSES.aggregate([
      {
        $match: {
          budgetName: budgetName,
          category: { $ne: "debt" }
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          expenses: {
            $push: {
              k: "$_id.category", 
              v: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          expenses: {
            $arrayToObject: "$expenses",
          },
        },
      },
      {
        $sort: {
          "year": 1,
          "month": 1,
        },
      },
    ]);

    if(getExpenses.length < 5) throw(ERROR_MESSAGE.NOT_ENOUGH_DATA)
    
    const getBudgetAllocated = await BUDGET.findOne({budgetOwner:email, budgetName} , {needs:1, savings:1,wants:1, _id:0})

    const getNeeds = getBudgetAllocated.needs.map((data) => [data.name, data.allocation])
    const getWants = getBudgetAllocated.wants.map((data) => [data.name, data.allocation])

    const allocation = {}

    getNeeds.forEach(([name, value]) => {
      allocation[name] = value;
    });
    
    getWants.forEach(([name, value]) => {
      if (allocation[name] !== undefined) {
        allocation[name] += value;
      } else {
        allocation[name] = value;
      }
    });    

    //predict results using linear regression
    const categories = Object.keys(getExpenses[0].expenses);
    const regressionResults = {};
    categories.forEach((category) => {
      let count = 0
      const categoryExpenses = getExpenses.map((data) => [count++, data.expenses[category]]);
      const result = regression.linear(categoryExpenses);
      const predict = result.predict(getExpenses.length + 1);
      regressionResults[category] = [predict[1], categoryExpenses[categoryExpenses.length-1][1]];
    });

    let finalResuts = {}
    for (const category in allocation) {
      if(allocation[category] < regressionResults[category]) {
        finalResuts[category] = {
          allocation:allocation[category],
          predictions:regressionResults[category][0],
          previousValue:regressionResults[category][1],
          isOverBudget:true
        }
      }else{
        finalResuts[category] = {
          allocation:allocation[category],
          predictions:regressionResults[category][0],
          previousValue:regressionResults[category][1],
          isOverBudget:false
        }
      }
    }

    return finalResuts

  }catch (error){
    throw error
  }
}

const COMPARE_EXPENSES = async (reqQuery) =>{
  try {

    const {budgetName, startDate, endDate} = reqQuery
    const getExpenses = await EXPENSES.aggregate([
      {
        $match: {
          budgetName: budgetName,
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          expenses: {
            $push: {
              k: "$_id.category", 
              v: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          expenses: {
            $arrayToObject: "$expenses",
          },
        },
      },
      {
        $sort: {
          "year": -1,
          "month": -1,
        },
      },
    ]);
    return getExpenses

  } catch (error) {
    throw error
  }
}

module.exports = {
  ANALYZE,
  COMPARE_EXPENSES
}