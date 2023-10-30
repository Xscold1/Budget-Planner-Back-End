const EXPENSES = require('../../models/expense-model');

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

const labelUserBehavior = (expenses, budgets) => {
  const labeledData = [];

  for (const userExpense of expenses) {
    const userBudget = budgets.find((budget) => budget.userId === userExpense.userId);

    if (userBudget) {
      // You may want to define your own criteria for labeling "good" and "bad" behavior
      const isGoodBehavior = userExpense.amount <= userBudget.totalBudget;

      const labeledExample = {
        userId: userExpense.userId,
        features: {
          // Include the same features as in Step 2
          totalExpenses: userBudget.totalExpenses,
          remainingBudget: userBudget.remainingBudget,
        },
        label: isGoodBehavior ? 'good' : 'bad',
      };

      labeledData.push(labeledExample);
    }
  }

  return labeledData;
}

// Call the labeling function
// const labeledData = labelUserBehavior(historicalExpenses, historicalBudgets);

module.exports = GET_DATA