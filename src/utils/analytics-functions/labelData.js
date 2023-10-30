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
const labeledData = labelUserBehavior(historicalExpenses, historicalBudgets);