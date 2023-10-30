const EXPENSES = require('../../models/expense-model');

const GET_DATA = async (userId) =>{
  try {
    const getData = await EXPENSES.find({userId:userId})

    let totalNeeds = 0, totalWants = 0, totalSavings = 0

    let mapData = getData.map((budgets) =>{
      totalNeeds += budgets.needs.amount
      totalWants += budgets.wants.amount
      totalSavings += budgets.savings.amount
    })

    return mapData
  } catch (error) {
    console.error(error)
  }
}

console.log(GET_DATA(new ObjectId("653dd516eba566787f8180ed")))
