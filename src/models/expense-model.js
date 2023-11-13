const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenses = new Schema({
  amount:Number,
  createdAt:Date,
  note:String,
  category:String,
  expenseType:String,
  budgetName:String,
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const model  = mongoose.model('expenses', expenses);

module.exports = model;