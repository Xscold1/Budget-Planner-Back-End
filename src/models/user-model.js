const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: 'String',
        index: { unique: true },
        required: true
    },
    userName: {
      type: 'String',
      index: { unique: true },
      required: true
    },
    password: {
      type: 'String',
      required: true
    },
    
})

const model  = mongoose.model('user', user);

module.exports = model;