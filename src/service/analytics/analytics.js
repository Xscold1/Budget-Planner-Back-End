//constants
const ERROR_MESSAGE = require('../../constants/error-message')

//utils
const findUserId = require('../../utils/findUserId')

//model
const BUDGET = require('../../models/budget-model')

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

module.exports = {
  ANALYZE,
}