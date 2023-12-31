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
      required: true
    },
    password: {
      type: 'String',
      required: true
    },
    ifNewUser:{
      type: 'Boolean',
      default: true
    },
    imageUrl:{
      type: 'String',
      default:"https://res.cloudinary.com/diwlgnbqc/image/upload/v1683221873/b9vfcnko2112n69whgla.jpg"
    },
    twoAuthRequired:{
      type: 'Boolean',
      default: false
    }
})

const model  = mongoose.model('user', user);

module.exports = model;