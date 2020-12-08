import {React, useEffect, useState, useRef} from 'react'
import Board from './Board/Board'
import './MyBoards.css'
import {Link,useLocation} from 'react-router-dom';
import axios from '../axios.js';
import AddIcon from '@material-ui/icons/Add';
import '../BoardScreen/BoardTodos/TodoList.css';
import {IconButton}  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Header from '../Header/Header';

function MyBoards() {

    const location = useLocation();

    const [showJoinNewBoard, setshowJoinNewBoard] = useState(false);
    const [showCreateNewBoard, setshowCreateNewBoard] = useState(false);
    const [myBoards, setmyBoards] = useState([]);
    const [newBoardID, setnewBoardID] = useState("");

    const [newBoardName, setnewBoardName] = useState("");
    const [newBoardDesc, setnewBoardDesc] = useState("");
    
    const userID = useRef("");
    const userName = useRef("");

    

    useEffect(async () => {

        console.log(location);
        userID.current = location.state.userUid;
        userName.current = location.state.userName;
        console.log("The user is",userID);
        console.log("Getting your boards");
        const boards = await axios.get('/getMyBoard',{
            "params":{
                "userID":userID.current
            }
        }
        ); 
        console.log(boards.data);
        setmyBoards(boards.data);
    }, [location])

    useEffect(() => {
        console.log("Hrllo");
    }, [])


    const toggleJoinNewBoard = (e)=>{
        console.log("Open join board screen");
        setshowJoinNewBoard(!showJoinNewBoard);
    }

    const toggleCreateNewBoard = (e)=>{
        console.log("Open join board screen");
        setshowCreateNewBoard(!showCreateNewBoard);
    }

    const updateBoardID=(e)=>{
        setnewBoardID(e.target.value);
    }
    const updateNewBoardName=(e)=>{
        setnewBoardName(e.target.value);
    }
    const updateNewBoardDesc=(e)=>{
        setnewBoardDesc(e.target.value);
    }

    const joinNewBoard= async (e)=>{
        e.preventDefault();
        console.log(userID);
        console.log(userID.current);
        const res = await axios.put('/newParticipant',{
            "boardID":newBoardID,
            "userID":userID.current
        });
        window.location.reload();

        
    }

    const createNewBord = async (e)=>{
        e.preventDefault();
        console.log(newBoardName,newBoardDesc);
        
        const res = await axios.post('/createNewBoard',{
            "boardName":newBoardName,
            "boardDesc":newBoardDesc,
            "boardCreator":userName.current,
            "todoLists":[],
            "participants":[userID.current]
        });
        toggleCreateNewBoard();
        window.location.reload();
    }

    return (
       
        <div className = "myBoards">
            <Header />
            <div className="grid__container">
            <div className = "new__boards"> 
                <div className="add__board">
                    <div className = "board__summary" onClick={toggleJoinNewBoard}>
                        <p>Join New Board</p>
                        <AddIcon  className="add__board"/>
                    </div>
                </div>
                <div className="add__board">
                    <div className = "board__summary" onClick={toggleCreateNewBoard}>
                        <p>Create New Board</p>
                        <AddIcon  className="add__board"/>
                    </div>
                </div>
            </div>
                {myBoards.map((board)=>(
                    <div>
                        <Link to={`/myboards/:${board._id}`}>
                            <Board className = "grid__item" name={board.boardName} about={board.boardDesc} userName = {userName}/>
                        </Link>
                    </div>
                ))}
            </div>


            <div className={showJoinNewBoard?"":"hide"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>Enter Board ID ...</p>
                            <IconButton onClick={toggleJoinNewBoard} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body" >
                            
                                <input autoFocus value={newBoardID} onChange={updateBoardID} className="add__inputs" type="text" />
                                <div className="add__footer">
                                    <button onClick={joinNewBoard} className="add__submit" value="UPDATE" type="submit" > JOIN </button>
                                    <div></div>
                                </div>
                            
                        </div>
                    </div>
                </div>  

                <div className={showCreateNewBoard?"":"hide"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>Create A New Board</p>
                            <IconButton onClick={toggleCreateNewBoard} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body" >
                                
                                <input autoFocus placeholder="Board Name" value={newBoardName} onChange={updateNewBoardName} className="add__inputs" type="text" />
                                <input autoFocus placeholder="Board Desc" value={newBoardDesc} onChange={updateNewBoardDesc} className="add__inputs" type="text" />

                                <div className="add__footer">
                                    <button onClick={createNewBord} className="add__submit" value="UPDATE" type="submit" > CREATE </button>
                                    <div></div>
                                </div>
                            
                        </div>
                    </div>
                </div>     


            </div>
        
    )
}

export default MyBoards
