module.exports =  getDefaultBudget = async (email) => {
  const getDefaultBudget = await BUDGET.find({ budgetOwner:email}, { budgetName: 1, limit: 1,startDate:1  }).sort({startDate: -1})
  
  return getDefaultBudget[0].budgetName
}