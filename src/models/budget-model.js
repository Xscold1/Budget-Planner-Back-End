const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budget = new Schema({
    startDate:{
      type: 'Date',
    },
    endDate:{
      type: 'Date',
    },
    totalBudget: {
      type: 'Number',
      default: 0,
    },
    totalExpenses: {
      type: 'Number',
      default: 0,
    },
    remainingBudget: {
      type: 'Number',
      default: 0,
    },
    needs:[
      {
        name: '',
        allocation: 0,
        expense: 0,
      }
    ],
    wants:[
      {
        name: '',
        allocation: 0,
        expense: 0,
      }
    ],
    savings:[
      {
        name: '',
        allocation: 0,
        expense: 0,
      }
    ],
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
})

const model  = mongoose.model('budget', budget);

module.exports = model;