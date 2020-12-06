import React, { useEffect, useState } from 'react'
import TodoComponent from './TodoComponent';
import EditIcon from '@material-ui/icons/Edit';
import { Icon, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import './TodoList.css';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'react-modal';
import axios from '../../axios.js';
import {socket} from '../../socket.js';
import { indigo } from '@material-ui/core/colors';

function TodoList({listData,listName,_id,todos,boardID}) {

    const [showEditIcons, setshowEditIcons] = useState(false);
    const [showModalEditHeader, setshowModalEditHeader] = useState(false);
    const [showTodoAdd, setshowTodoAdd] = useState(false);
    const [listTitle, setlistTitle] = useState(listName);
    const [listItems, setlistItems] = useState(todos);
    const [newTodo, setnewTodo] = useState("");

    useEffect(() => {
        // console.log(_id);
        // console.log(listName);
        // console.log(todos);     
    }, [])

    const mouseEnteredTitle = (e) =>{
        console.log("Hover detected");
        console.log(showEditIcons);
        setshowEditIcons(true);
        console.log(showEditIcons);
    }

    const mouseLeftTitle = (e) =>{
        console.log("Hover done");
        setshowEditIcons(!showEditIcons);
    }

    const editTitle = (e) =>{
        setlistTitle(e.target.value);
        console.log("New title");
    }

    const changeTitle = (e) =>{
        e.preventDefault(); 
        console.log("title changes");
        setshowModalEditHeader(!showModalEditHeader);
        //setshowEditHeader(!showEditHeader);
    }

    const addTodoToggle=()=>{
        setshowTodoAdd(!showTodoAdd);
    }

    const updateNewTodo =(e)=>{
        setnewTodo(e.target.value);
    }

    const addItem = async (e)=>{
        
        e.preventDefault();



        if(newTodo===""){
            setnewTodo("");
            addTodoToggle();
            return 0;
        } 

        const rbs = document.querySelectorAll('input[name="Stage"]');
        let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }
        console.log("Your boi has selected the stage",selectedValue);

        console.log(newTodo);
        console.log(_id);
        const res = await axios.put('/addTodoItem',{
            "boardID":boardID.substring(1,boardID.length),
            "listID":_id,
            "newTodo":{
                "todo":newTodo,
                "stageBy":"Malhar Pattekar",
                "Stage":selectedValue
            }
        });
        
      

        console.log(res);

        setlistItems([...listItems,{
            _id:res.data,
            todo:newTodo,
            stageBy:"Malhar Pattekar",
            Stage:selectedValue
        }]);

        listData.current.map((list)=>{
            if(list._id===_id){
                list.todos = [...list.todos,{
                    _id:res.data,
                    todo:newTodo,
                    stageBy:"Malhar Pattekar",
                    Stage:selectedValue
                }]
            }
        })

        socket.emit('newTodo',{
            "boardID":boardID.substring(1,boardID.length),
            "listID":_id,
            "newTodo":{
                "_id":res.data,
                "todo":newTodo,
                "stageBy":"Malhar Pattekar",
                "Stage":selectedValue
            }
        });

        setnewTodo("");
        addTodoToggle();
    }

    return (
        <div className = "todo__list">
                    <div onMouseEnter={mouseEnteredTitle} onMouseLeave={mouseLeftTitle} className = "list__header">
                        <div></div>
                        <div className="header__title">                       
                            {
                                showModalEditHeader?(
                                    <form onSubmit={changeTitle}>
                                        <input autoFocus className="header__input" type="text-area" value={listTitle} onChange={editTitle}/>
                                        <input className="headerEdit__submit" type="submit" value="Submit" />
                                    </form>
                                
                                ):(<p className = "list__name">{listTitle}</p>)
                            }
                        </div>
                        <div>
                            <div></div>
                            <EditIcon onClick={()=>setshowModalEditHeader(true)} className={showEditIcons?"":"dontEdit"} fontSize="small"/>
                        </div>
                    </div>
                    <div className="list__todos">
                        {listItems.map((todo)=>(
                            <div>
                                <TodoComponent listData = {listData} todoID = {todo._id} boardID = {boardID} listID = {_id} todo={todo.todo} stageBy={todo.stageBy} stage={todo.Stage}/>
                            </div>
                        ))}
                        <div className="add__todo"onClick={addTodoToggle}>
                            <AddIcon />
                        </div>
                    </div>
                    
                    {/* Modal to edit the value of the title of the list */}
                <div className={showTodoAdd?"":"dontShow"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>Add Todo Item</p>
                            <IconButton onClick={addTodoToggle} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body" >
                            <form onSubmit={addItem}>
                                <p className="add__labels">Todo..</p>
                                <input autoFocus value={newTodo} onChange={updateNewTodo} className="add__inputs" type="text" />
                                <div className="add__stageSelection">
                                    <div className="add__stageSelect pending">
                                        <input type="radio" id="PENDING" name="Stage" value="PENDING"/>
                                        <label for = "PENDING"> PENDING </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect ongoing">
                                        <input type="radio" id="ONGOING" name="Stage" value="ONGOING"/>
                                        <label for = "ONGOING"> ONGOING </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect done">
                                        <input type="radio" id="DONE" name="Stage" value="DONE"/>
                                        <label for = "DONE"> DONE </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect emergency">
                                        <input type="radio" id="EMERGENCY" name="Stage" value="EMERGENCY"/>
                                        <label for = "EMERGENCY"> EMERGENCY </label>
                                    </div>
                                </div>
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

export default TodoList
