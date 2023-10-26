const mongoose = require('mongoose')
const Schema = mongoose.Schema

const debt = new Schema({
  
  totalDebt:Number,
  balance:Number,
  dueDate:Date,
  interest:Number,
  name:String,
  payments:[{
    paymentDate:Date,
    amount:Number,
  }],
  status:{
    type:String,
    default:"Still Paying"
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  debtType:{
    type:String,
    enums:['lend, borrowed']
  }
})

const model  = mongoose.model('debt', debt);
module.exports = model