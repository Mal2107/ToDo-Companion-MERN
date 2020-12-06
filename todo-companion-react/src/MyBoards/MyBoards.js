import {React, useEffect, useState} from 'react'
import Board from './Board/Board'
import './MyBoards.css'
import {Link,useLocation} from 'react-router-dom';
import axios from '../axios.js';

function MyBoards() {

    const location = useLocation();
    var userID = "";
    var userName = "";
    

    const [myBoards, setmyBoards] = useState([]);

    useEffect(async () => {

        console.log(location);
        userID = location.state.userUid;
        userName = location.state.userName;
        console.log("The user is",userID);

        console.log("Getting your boards");
        const boards = await axios.get('/getMyBoard',{
            "params":{
                "userID":userID
            }
        }
        ); 
        console.log(boards.data);
        setmyBoards(boards.data);
    }, [location])

    
    const boards = [
        {
            name:"Board 1",
            about:"Blah blah balh",
        },
        {
            name:"Board 2",
            about:"Blah blah balh",
        },
        {
            name:"Board 3",
            about:"Blah blah balh",
        },
        {
            name:"Board 4",
            about:"Blah blah balh",
        },
        {
            name:"Board 5",
            about:"Blah blah balh",
        }
    ]

    return (
        <div className = "myBoards">
            <div className="grid__container">
            <h1>{userID}</h1>
                {}
                {myBoards.map((board)=>(
                    <div>
                        <Link to={`/myboards/:${board._id}`}>
                            <Board className = "grid__item" name={board.boardName} about={board.boardDesc} userName = {userName}/>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBoards
