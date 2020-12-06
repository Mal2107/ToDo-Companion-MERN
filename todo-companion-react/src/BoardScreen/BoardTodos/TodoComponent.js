import React, {useState} from 'react'
import './TodoComponent.css'
import EditIcon from '@material-ui/icons/Edit';
import { Button, Modal } from '@material-ui/core';
import {IconButton}  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {socket} from '../../socket.js';
import axios from '../../axios.js';

function TodoComponent({listData,todoID,boardID,listID,todo,stageBy,stage}) {

    const [editIconDisplay, seteditIconDisplay] = useState(false);
    const [show, setShow] = useState(false);
    const [showUpdateStage, setshowUpdateStage] = useState(false);
    const [newStage,setNewStage] = useState(stage);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const editTodo = ()=>{
        console.log("Edit the todo");
    }

    const showEdit=()=>{
        seteditIconDisplay(!editIconDisplay);
    }

    const updateStageToggle=(e)=>{
        console.log("Update the stage");
        setshowUpdateStage(!showUpdateStage);
    }

    const updateStage=async(e)=>{
        e.preventDefault();
        const rbs = document.querySelectorAll('input[name="StageUpdate"]');
        let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }

        setNewStage(selectedValue);
        console.log("Update the value to ",selectedValue);
        updateStageToggle();

        const res = await axios.put('/updateTodoItem',{
            "boardID":boardID.substring(1,boardID.length),
            "listID":listID,
            "todoID":todoID,
            "updatedTodo":{
                "todo":todo,
                "stageBy":stageBy,
                "Stage":selectedValue
            }
        });

        socket.emit('newTodoStage',{
            "boardID":boardID.substring(1,boardID.length),
            "listID":listID,
            "todoID":todoID,
            "updatedTodo":{
                "todo":todo,
                "stageBy":stageBy,
                "Stage":selectedValue
            }
        });

        var updatedList = [];
        listData.current.map(list=>{
            if(list._id===listID){
                list.todos.map(todo=>{
                    if(todo._id===todoID){
                        todo.Stage = selectedValue;
                        todo.stageBy = stageBy;
                    }
                });
            }
            updatedList.push(list);
        });
        listData.current = updatedList;
        

    }

    return (
        <div onDoubleClick={updateStageToggle} className = {`todoComponent ${newStage==="PENDING"?"pending":newStage==="ONGOING"?"ongoing":newStage==="DONE"?"done":"emergency"}`} onMouseEnter={showEdit} onMouseLeave={showEdit}>
            <p>
                {todo}
            </p> 

            <div className={showUpdateStage?"":"hide"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>Update Stage</p>
                            <IconButton onClick={updateStageToggle} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body" >
                            
                            <div className="add__stageSelection">
                                    <div className="add__stageSelect pending">
                                        <input type="radio" id="PENDING" name="StageUpdate" value="PENDING"/>
                                        <label for = "PENDING"> PENDING </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect ongoing">
                                        <input type="radio" id="ONGOING" name="StageUpdate" value="ONGOING"/>
                                        <label for = "ONGOING"> ONGOING </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect done">
                                        <input type="radio" id="DONE" name="StageUpdate" value="DONE"/>
                                        <label for = "DONE"> DONE </label>
                                    </div>
                                    
                                    <div className = "add__stageSelect emergency">
                                        <input type="radio" id="EMERGENCY" name="StageUpdate" value="EMERGENCY"/>
                                        <label for = "EMERGENCY"> EMERGENCY </label>
                                    </div>
                                </div>
                                <div className="add__footer">
                                    <button onClick={updateStage} className="add__submit" value="UPDATE" type="submit" > UPDATE </button>
                                    <div></div>
                                </div>
                            
                        </div>
                    </div>
                </div>



        </div>        
    )
}

export default TodoComponent
