const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenses = new Schema({
  amount:{
    type: "Number",
    default: 0,
  },
  createdAt:{
    type: "Date",
    default: Date.now()
  },
  note:{
    type: "String",

  },
  expenseType: {
    type: "String",
    enums:["needs", "wants", "savings"]
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'budget'
  }
})

const model  = mongoose.model('expenses', expenses);

module.exports = model;