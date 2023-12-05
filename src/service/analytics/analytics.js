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

    const userId = await findUserId(email)

    const userBudget = await BUDGET.findOne({ userId: {$in:[userId]}, budgetName:budgetName }).populate('needs.expenses wants.expenses');
    const getBudgetAllocated = await BUDGET.findOne({budgetOwner:email, budgetName} , {needs:1, savings:1,wants:1, _id:0})

    if (!userBudget)throw(ERROR_MESSAGE.BUDGET_DOES_NOT_EXIST)

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

    const allocation = {
      needs: [],
      wants: [],
    }
    getBudgetAllocated.needs.map((data) => allocation.needs.push({[data.name]: data.allocation}))
    getBudgetAllocated.wants.map((data) => allocation.wants.push({[data.name]: data.allocation}))
    const getSavings = getBudgetAllocated.savings.map((data) => [data.name, data.allocation])

    let finalResults = {
      isOverBudgetThisMonth:false,
      isNeedsOverBudget:false,
      isWantsOverBudget:false,
      isNoSavings:getSavings.length > 0 || getSavings === undefined ? false: true,
    }

    // check if over budget this month
    //------------------------------------
    for (const need of userBudget.needs) {
      let totalExpenses = 0;
      for (const expense of need.expenses) {
        totalExpenses += expense.amount;
      }
      if (totalExpenses > need.allocation) {
        finalResults.isOverBudgetThisMonth = true;
      }
    }
    for (const wants of userBudget.wants) {
      let totalExpenses = 0;
      for (const expense of wants.expenses) {
        totalExpenses += expense.amount;
      }
      if (totalExpenses > wants.allocation) {
        finalResults.isOverBudgetThisMonth = true;
      }
    }
    //------------------------------------------------
    //predict results using linear regression

    const categories = Object.keys(getExpenses[0].expenses);
    const regressionResults = {};
    categories.forEach((category) => {
      let count = 0
      const categoryExpenses = getExpenses.filter(data => data.expenses[category] !== undefined).map((data) => [count++, data.expenses[category]]);
      const result = regression.linear(categoryExpenses);
      const predict = result.predict(getExpenses.length + 1);
      regressionResults[category] = [predict[1], categoryExpenses[categoryExpenses.length-1][1]];
    });

    allocation.wants.map((category) => {
      const categoryKey = Object.keys(category)[0];
      const categoryValue = Object.values(category)[0];
    
      if (categoryKey && categoryValue !== undefined &&
        regressionResults[categoryKey] && regressionResults[categoryKey][0] !== undefined) {
    
        if (categoryValue < regressionResults[categoryKey][0]) {
          finalResults.isWantsOverBudget = true;
          finalResults[categoryKey] = {
            allocation: categoryValue,
            predictions: regressionResults[categoryKey][0],
            previousValue: regressionResults[categoryKey][1],
            isOverBudget: true,
          };
        } else {
          finalResults[categoryKey] = {
            allocation: categoryValue,
            predictions: regressionResults[categoryKey][0],
            previousValue: regressionResults[categoryKey][1],
            isOverBudget: false,
          };
        }
      }
    });
    
    allocation.needs.map((category) => {
      const categoryKey = Object.keys(category)[0];
      const categoryValue = Object.values(category)[0];
    
      if (categoryKey && categoryValue !== undefined &&
        regressionResults[categoryKey] && regressionResults[categoryKey][0] !== undefined) {
    
        if (categoryValue < regressionResults[categoryKey][0]) {
          finalResults.isNeedsOverBudget = true;
          finalResults[categoryKey] = {
            allocation: categoryValue,
            predictions: regressionResults[categoryKey][0],
            previousValue: regressionResults[categoryKey][1],
            isOverBudget: true,
          };
        } else {
          finalResults[categoryKey] = {
            allocation: categoryValue,
            predictions: regressionResults[categoryKey][0],
            previousValue: regressionResults[categoryKey][1],
            isOverBudget: false,
          };
        }
      }
    });
    
    
    return finalResults

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