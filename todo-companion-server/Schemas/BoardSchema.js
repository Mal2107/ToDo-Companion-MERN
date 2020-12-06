// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
    todo:String,
    stageBy:String,
    Stage:String
});

const boardListSchema = mongoose.Schema({
    listName:String,
    todos:[todoSchema]
});

const boardSchema = mongoose.Schema({
    boardName:String,
    boardDesc:String,
    boardCreator:String,
    participants:[{
        type:String
    }],
    todoLists:[boardListSchema]
});

module.exports = mongoose.model('board',boardSchema);