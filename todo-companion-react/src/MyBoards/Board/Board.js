import React from 'react'
import './Board.css'

function Board({name,boardDesc,boardID}) {

    const handleHover = (e) =>{
        e.preventDefault();
    }

    return (
        <div className="board">
            <div className = "board__summary">
                <p>{name}</p>
                <p onMouseOver={handleHover}>{boardDesc}</p>
            </div>
        </div>
        
    )
}

export default Board
