const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: 'String',
        index: { unique: true }
    },
    userName: {
      type: 'String',
      index: { unique: true }
    },
    password: {
      type: 'String'
    },
    
})

const model  = mongoose.model('user', user);

module.exports = model;