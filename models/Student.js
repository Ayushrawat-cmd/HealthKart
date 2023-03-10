const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Roll_No: {
    type: Number,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Institute: {
    type: String,
    required: true
  },
  Course:{
    type: String,   
    required : true
  },
  Email:{
    type: String,   
    required : true
  },
});

module.exports = mongoose.model('Student', studentSchema);
