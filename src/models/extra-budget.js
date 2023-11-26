const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraBudget = new Schema({
  budgetOwner:String,
  dateToBeAdded:Date,
  budgetName:String,
  amount:Number,
  note:String
})

const model = mongoose.model('extraBudget', extraBudget);

module.exports = model