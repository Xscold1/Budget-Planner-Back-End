//constants
const ERROR_MESSAGE = require('../../constants/error-message')

//utils
const findUserId = require('../../utils/findUserId')

//model
const BUDGET = require('../../models/budget-model')
const EXPENSES = require('../../models/expense-model')

const ANALYZE = async (reqQuery) =>{
  try {

    const {email, budgetName} = reqQuery
    const userId = await findUserId(email)
    
    const userBudget = await BUDGET.findOne({ userId: {$in:[userId]}, budgetName:budgetName }).populate('needs.expenses wants.expenses');
    let isEmergencyFundsExist = false

    if (userBudget && userBudget.savings) {
      for (const saving of userBudget.savings) {
        // Assuming the emergency fund has a predefined name like "Emergency Fund"
        if (saving.name === 'Emergency Fund' && saving.expenses.length > 0) {
          isEmergencyFundsExist = true;
          break; // No need to continue checking if emergency funds are found
        }
      }
    }

    if (!userBudget)throw(ERROR_MESSAGE.BUDGET_DOES_NOT_EXIST)

    const overspentItems = [];

    for (const need of userBudget.needs) {
      let totalExpenses = 0;
      for (const expense of need.expenses) {
        totalExpenses += expense.amount;
      }
      if (totalExpenses > need.allocation) {
        overspentItems.push({ category: 'needs', name: need.name, overspent: totalExpenses - need.allocation });
      }
    }

    for (const wants of userBudget.wants) {
      let totalExpenses = 0;
      for (const expense of wants.expenses) {
        totalExpenses += expense.amount;
      }

      if (totalExpenses > wants.allocation) {
        overspentItems.push({ category: 'wants', name: wants.name, overspent: totalExpenses - wants.allocation });
      }
    }

    if(overspentItems.length < 0) {
      return "Your doing great on your budgeting keep it up"
    }

    return {
      overspentItems,
      isEmergencyFundsExist
    };
  }
  catch (error){
    throw error
  }
}

const COMPARE_EXPENSES = async (reqQuery) =>{
  try {

    const {budgetName, startDate, endDate} = reqQuery
    // const getExpenses = await EXPENSES.aggregate([
    //   {
    //     $match: {
    //       budgetName: budgetName,
          // $expr:{createdAt:{$gte:["$createdAt", startDate]}},
          // $expr:{createdAt:{$lte:["$createdAt", endDate]}},
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$createdAt" },
    //         month: { $month: "$createdAt" },
    //         expenseType: "$expenseType",
    //       },
    //       expenses: {
    //         $push: {
    //           category: "$category",
    //           name: "$name",
    //           note: "$note",
    //           type: "$expenseType",
    //           amount: "$amount",
    //           createdAt: "$createdAt",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: "$_id.year",
    //         month: "$_id.month",
    //       },
    //       expenses: {
    //         $push: {
    //           type: "$_id.expenseType",
    //           data: "$expenses",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $sort: {
    //       "_id.year": -1,
    //       "_id.month": -1,
    //     },
    //   },
    // ]);
    const getExpenses = await EXPENSES.aggregate([
      {
        $match: {
          budgetName: budgetName,
          $expr:{createdAt:{$gte:["$createdAt", startDate]}},
          $expr:{createdAt:{$lte:["$createdAt", endDate]}},
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            expenseType: "$expenseType",
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
            expenseType: "$_id.expenseType",
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
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          expenses: {
            $push: {
              k: "$_id.expenseType",
              v: {
                $arrayToObject: "$expenses",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          expenses: {
            $arrayToObject: "$expenses",
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
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