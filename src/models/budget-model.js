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
      }
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
    }
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
    }
  }],
  userId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
})

const model  = mongoose.model('budget', budget);

module.exports = model;