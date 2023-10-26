const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sharedAccountBudget = new Schema({

})

const model  = mongoose.model('sharedAccountBudget', sharedAccountBudget);
module.exports = model