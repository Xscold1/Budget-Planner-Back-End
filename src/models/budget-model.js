const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budget = new Schema({
    startDate:{
      type: 'Date',
      required: true,
      default: Date.now()
    },
    endDate:{
      type: 'Date',
      required: true,
      default: Date.now(),
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
      }],
    wants:[{
      name: {
        type: 'String'
      },
      allocation: {
        type: 'number',
        default: 0,
      },
    }],
    savings:[{
      name: {
        type: 'String'
      },
      allocation: {
        type: 'number',
        default: 0,
      },
    }],
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
})

const model  = mongoose.model('budget', budget);

module.exports = model;