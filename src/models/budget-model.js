const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budget = new Schema({
  budgetName:{
    type:"String",
    required: true
  },
  startDate:{
    type: 'Date',
    required: true,
    default: Date.now()
  },
  totalBudget: {
    type: 'Number',
    default: 0,
    required: true,
  },
  totalExpenses: {
    type: 'Number',
    default: 0,
  },
  remainingBudget: {
    type: 'Number',
    default: 0,
  },
  budgetType:{
    type: 'String',
    enums:['weekly', 'monthly'],
  },
  lastResetDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  budgetRatio:{
    type: String,

  },
  budgetOwner:{
    type:String,
  },
  needs:[{
      name: {
        type: 'String'
      },
      allocation: {
        type: 'number',
        default: 0,
      },
      iconId:{
        type: 'String',
        required: true
      },
      expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenses'
      }]
    }],
  wants:[{
    name: {
      type: 'String'
    },
    allocation: {
      type: 'number',
      default: 0,
    },
    iconId:{
      type: 'String',
      required: true
    },
    expenses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'expenses'
    }]
  }],
  savings:[{
    name: {
      type: 'String'
    },
    allocation: {
      type: 'number',
      default: 0,
    },
    iconId:{
      type: 'String',
      required: true
    },
    expenses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'expenses'
    }]
  }],
  userId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
})

const model  = mongoose.model('budget', budget);

module.exports = model;