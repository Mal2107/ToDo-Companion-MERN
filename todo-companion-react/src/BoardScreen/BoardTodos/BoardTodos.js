import React, {useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router';
import './BoardTodos.css';
import axios from '../../axios.js';
import TodoList from './TodoList';
import AddIcon from '@material-ui/icons/Add';
import {IconButton}  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { v4 as uuidv4 } from 'uuid';
import {socket} from '../../socket';


function BoardTodos({boardID}) {
    console.log("Rerendering!!!");
    const params = useParams();
    const [lists, setlists] = useState([]);
    const [showModalEditHeader, setshowModalEditHeader] = useState(false);
    const [showTodoAdd, setshowTodoAdd] = useState(false);
    const [newList, setnewList] = useState("");


    var listsCopyVar = [];

    const listData = useRef([]);

    useEffect(async ()=>{    
    
        console.log(boardID); //logging the board id

        //api call to get board data

        const res = await axios.get('/myBoard',{
            params:{
                boardID:boardID.substring(1,boardID.length)
            }
        });

        console.log("Data from monog is",res);
        //data is coming as a obect in which data carries a array of documents so taking the 0th index of the array
        
        
        
        //taking the data about the todo lists from the entire board data
        listsCopyVar = res.data[0].todoLists;

        listData.current = res.data[0].todoLists;

        setlists(res.data[0].todoLists); 
               
        socket.emit('joinBoard',boardID.substring(1,boardID.length));  
         
        socket.on('updateTodos',(data)=>{
            var updatedList = [];
            updatedList = [];

            listData.current.map(list=>{
                console.log(list._id);
                if(list._id==data.listID){
                    console.log("Its this one ",list);
                    list.todos = [...list.todos,data.newTodo];
                    console.log("Adding something ",list);
                }
                updatedList.push(list);
            });
            setlists([]);
            listData.current = updatedList;
            setlists(listData.current);
        });     

        socket.on('updateTodoStage',(data)=>{
            var updatedList = [];
            updatedList = [];
            listData.current.map(list=>{
                console.log(list._id);
                if(list._id===data.listID){
                    list.todos.map(todo=>{
                        if(todo._id===data.todoID){
                            todo.Stage = data.updatedTodo.Stage;
                            todo.stageBy = data.updatedTodo.stageBy;
                        }
                    });
                }
                updatedList.push(list);
            });
            setlists([]);
            listData.current = updatedList;
            setlists(listData.current);
        });
 
        socket.on('updateLists',(data)=>{
            console.log("Updating the lists in real time",data);
            listData.current = [...listData.current,data.newList];
            var updateList = [];
            setlists(listData.current);
            
        });     

    },[]);    

    

    const addTodoToggle=()=>{
        setshowTodoAdd(!showTodoAdd);
    }

    const newlist=()=>{
        console.log("Get a new list");

    }

    const addList= async (e)=>{
        e.preventDefault();

        const res = await axios.put('/addListToBoard',{
            "boardID":boardID.substring(1,boardID.length),
            "newList":{
                "listName":newList,
                "todos":[]
            }
        });

        listData.current = [...listData.current,{
            _id:res.data,
            listName:newList,
            todos:[]
        }];

        setlists(listData.current);

        console.log("List copy var ka value is ",listData.current);

        socket.emit('newList',{
                "boardID":boardID.substring(1,boardID.length),
                "newList":{
                    _id:res.data,
                    listName:newList,
                    todos:[]
                }
            
            }
        );

        console.log(res);
        addTodoToggle();
        setnewList("");
    }
    const updateNewList =(e)=>{
        setnewList(e.target.value);
    }

    return (
        <div className = "boardTodos">
            
                {lists.length===0?(
                    <div className="boardTodo__listDiv">
                        <p>Getting your data</p>
                    </div>
                ):(
                            lists.map((list)=>(
                                <div className="boardTodo__listDiv">
                                    <TodoList  listData = {listData} listName = {list.listName} _id = {list._id} todos={list.todos} boardID = {boardID} />
                                </div>
                            
                        )
                    )            
                )}
                <div className="boardTodo__newList" onClick={addTodoToggle}>
                          <AddIcon />
                </div>


                     {/* Modal to edit the value of the title of the list */}
                     <div className={showTodoAdd?"":"dontShow"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>Add New List</p>
                            <IconButton onClick={addTodoToggle} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body" >
                            <form onSubmit={addList}>
                                <p className="add__labels">Title..</p>
                                <input autoFocus value={newList} onChange={updateNewList} className="add__inputs" type="text" />
                                <div className="add__footer">
                                    <input className="add__submit" value="Add" type="submit" />
                                    <div></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            
        </div>
    )
}

export default BoardTodos
