import {React, useEffect, useState} from 'react'
import ChatIcon from '@material-ui/icons/Chat';
import CloseIcon from '@material-ui/icons/Close';
import { Avatar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import './Header.css';

function Header({boardID,boardName,boardDesc,boardCreator}) {

    const [showBoardData, setshowBoardData] = useState(false);

    useEffect(() => {
        console.log(boardID,boardName,boardDesc,boardCreator);
    }, []);

    const toggleShowBoardData = (e)=>{
        setshowBoardData(!showBoardData);
    }

    return (
        <div className="header">
            <div className="header__left">
            <p>Companion</p>
                
            </div>
            <div className="header__center">
                {/* <img className="header__logo" src = "https://to-do-cdn.microsoft.com/static-assets/c87265a87f887380a04cf21925a56539b29364b51ae53e089c3ee2b2180148c6/icons/logo.png" alt="app__logo" /> */}
                
            </div>
            

            <div className="header__right">
                <IconButton onClick={toggleShowBoardData}>
                    <MenuIcon className="header__menuIcon" />
                </IconButton>
                
            </div>

            <div className={showBoardData?"":"dontShow"}>
                    <div className="add__overlay"></div>
                    <div className="add__todoBox ">
                        <div className="add__header" >
                            <p>BOARD DATA</p>
                            <IconButton onClick={toggleShowBoardData} className="header__closeIcon">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className="add__body boardDataContent" >
                                <p className="add__labels">BoardName: {boardName}</p>
                                <p className="add__labels">BoardDesc: {boardDesc}</p>
                                <p className="add__labels">ShareID: {boardID}</p>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Header
