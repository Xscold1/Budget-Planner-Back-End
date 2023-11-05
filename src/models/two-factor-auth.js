const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const twoAuth = new Schema({
    email: {
        type: 'String',
        index: { unique: true },
        required: true
    },
    code:{
      type: Number,
    },
    checkIf2FAIsCorreact:{
      type: 'Boolean',
      default: false
    }
})

const model  = mongoose.model('twoAuth', twoAuth);

module.exports = model;