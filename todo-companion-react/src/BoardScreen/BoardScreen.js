import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import './BoardScreen.css'
import BoardTodos from './BoardTodos/BoardTodos'


function BoardScreen() {
    
    const params = useParams();
    

    useEffect(()=>{
        console.log("BOARD SCREEN");
        console.log(params.id);

    },[]);
    return (
        <div className = "boardScreen">
            <BoardTodos boardID={params.id}/>
        </div>
    )
}

export default BoardScreen
