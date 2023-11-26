const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestAccess = new Schema({
  budgetOwner:String,
  userEmail:String,
  status:{
    type:Boolean,
    default:false
  },
})

const model = mongoose.model('requestAccess', requestAccess);

module.exports = model