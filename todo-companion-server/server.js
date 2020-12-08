//importation
    // import express from 'express';
    // import mongoose from 'mongoose';
    // import User from './Schemas/UserSchemas.js';
    // import Board from './Schemas/BoardSchema.js';
    // import uuid from 'uuidv4';
    // import  ObjectID  from 'mongodb';
    // import cors from 'cors';
    // import * as socketIO from "socket.io"
    // const socketIO = require('socket.io');

    const express = require('express');
    const http = require("http");
    const mongoose = require('mongoose');
    const User = require('./Schemas/UserSchemas');
    const Board = require('./Schemas/BoardSchema');
    const ObjectID = require('mongodb');
    const cors = require('cors');
    const socketIo = require("socket.io");



//app config
    const app = express();
    const port = process.env.PORT || 9000;
    const idgen = ObjectID.ObjectId;
    const server = http.createServer(app);
    const io = socketIo(server,{
        cors:{
            origin:"http://localhost:3000",
            methods:["GET","POST"]
        }
    });
//middle ware

    app.use(express.json());
    app.use(cors());

//db config
    const connectionURL = "mongodb+srv://admin:599PmNaNaSLzVyU@cluster0.kyvan.mongodb.net/todocompaniondb?retryWrites=true&w=majority";
    mongoose.connect(connectionURL,{
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    const db = mongoose.connection;
    db.once('open',()=>{
    console.log("Connected to mongo db");
});

//socket io
io.on('connection',(socket)=>{
    console.log("A client joined");

    socket.on('joinBoard',(boardID)=>{
        console.log("data coming from functions",boardID);
        socket.join(boardID);
    });

    socket.on('newTodo',(data)=>{
        console.log("websocket ",data);
        socket.to(data.boardID).emit('updateTodos',data);
    });

    socket.on('newList',(data)=>{
        console.log("websocket ",data);
        socket.to(data.boardID).emit('updateLists',data);
    });

    socket.on('newTodoStage',(data)=>{
        console.log("websocket ",data);
        socket.to(data.boardID).emit('updateTodoStage',data);
    });

    socket.on('disconnect',()=>{
        console.log("User disconnected");
    });
});

//apis
    app.get('/',(req,res)=>{
        console.log(req.body);
        res.status(200).send("Hello World this is working");
    });

    //auth API's
    app.post('/signUp',(req,res)=>{
        const newListId = new idgen();
        const auth = req.body;
        auth._id = newListId;
        console.log(auth.userName);
        console.log(auth.pwd);
        User.find({'userName':auth.userName},(err,data)=>{
            if(err){
                res.status(500).send(err);
            }else{
                if(data.length>0){
                    res.status(201).send({
                        "authStatus":2 //user name taken
                    });
                }else{
                    User.create(auth,(err,data)=>{
                        if(err){
                            res.status(500).send(err);
                        }else{
                            res.status(201).send(newListId)
                        }
                    });   
                }
            }
        });
    });

    //sign in 
    app.post('/signIn',(req,res)=>{
        const auth = req.body;
        console.log(auth.userName);
        console.log(auth.pwd);
        User.find({'userName':auth.userName,'pwd':auth.pwd},(err,data)=>{
            if(err){
                res.status(500).send(err);
            }else{
                if(data.length>0){
                    console.log("Sign in successful");
                    res.status(201).send(data);
                }else{
                    console.log("Sign in failed");
                    res.status(201).send(data);
                }
            }
        });   
    });

    //create board api
    app.post('/createNewBoard',(req,res)=>{
        const data = req.body;
        console.log(data);
        Board.create(data,(err,data)=>{
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(data);
            }
        })
    });

    //get entire board data
    app.get('/myBoard',(req,res)=>{
        const boardInfo = req.query.boardID;
        console.log("The board is - ");
        console.log(boardInfo);
        Board.find({"_id":boardInfo},(err,data)=>{
            console.log(data);
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(data);
            }
        });
    });

    //add participants to the board
    app.put('/newParticipant',(req,res)=>{
        const info = req.body;
        console.log(info);
        Board.find({"_id":info.boardID},(err,data)=>{
            if(err){
                res.status(500).send(err);
            }else{
                if(data.length>0){
                    console.log("Found a board to update");
                    Board.updateOne({"_id":info.boardID},{
                        $push: {
                            participants: info.userID
                        } 
                    },(err,data)=>{
                        if(err){
                            res.status(500).send(err);
                        }else{
                            res.status(200).send(data);
                        }
                    });
                    
                }else{
                    console.log("No board like that");
                }
            }
        })
    });

    //find my boards
    app.get('/getMyBoard',(req,res)=>{

        const user = req.query;
        console.log(user);
        console.log(user.userID);
        User.find({"_id":user.userID},(err,data)=>{
            if(err){
                res.status(500).send(err);
            }else{
                console.log("Now finind the boards");
                Board.find(
                    {"participants":{$all:[user.userID]}}
                    ,{ boardName: 1, boardDesc: 1, boardCreator:1 },(err,data)=>{
                    if(err){
                        res.status(500).send(err);
                    }else{
                        console.log("Found boards");
                        res.status(200).send(data);     
                    }
                });
            }
        }); 
    });

    //add a list to the board
    app.put('/addListToBoard',(req,res)=>{
        const newListId = new idgen();
        console.log(newListId);
        const info = req.body;
        console.log(info);
        Board.updateOne({"_id":info.boardID},{
            $push:{
                todoLists:{
                    "_id":newListId,
                    "listName":info.newList.listName,
                    "todos":info.newList.todos,
                }
            }
        },(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                console.log("Adding new list to the board");
                console.log(newListId);
                res.status(200).send(newListId);

            }
            
        })
    });

    //add a todo item to a list in a board
    app.put('/addTodoItem',(req,res)=>{
        const info = req.body;
        const newTodoId = new idgen();
        info.newTodo._id = newTodoId;
        console.log(info);
        Board.updateOne({"_id":info.boardID},{
            $push:{
                "todoLists.$[listIndex].todos":info.newTodo
            }            
        },{
            "arrayFilters":[
                {
                    "listIndex._id":info.listID
                }
            ]
        },(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                console.log("Adding new todo item to the board");
                console.log(data);
                res.status(200).send(newTodoId);
            }
        });
    });

    //update a todo item in list in a board
    app.put('/updateTodoItem',(req,res)=>{
        const info = req.body;
        console.log(info);
        Board.updateOne({"_id":info.boardID},{
            $set:{

                "todoLists.$[i].todos.$[j].todo":info.updatedTodo.todo,
                "todoLists.$[i].todos.$[j].stageBy":info.updatedTodo.stageBy,
                "todoLists.$[i].todos.$[j].Stage":info.updatedTodo.Stage

            },
           
        },{
            arrayFilters:[
               {
                   "i._id":info.listID
               },
               {
                  "j._id":info.todoID
               }
            ]
        },(err,data)=>{
            if(err){
                console.log("ERRORRRR!! ",err);
                res.status(500).send(err);
            }else{
                console.log(data);
                res.status(200).send(data);
            }
        });
    });

//listners
server.listen(port,()=>{
    console.log("Lisiting to port ",port);
});




