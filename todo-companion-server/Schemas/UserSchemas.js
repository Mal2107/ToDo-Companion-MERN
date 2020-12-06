// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName:String,
    pwd:String,
});

module.exports = mongoose.model('user',userSchema);