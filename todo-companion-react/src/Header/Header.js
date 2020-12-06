import React from 'react'
import './Header.css';
import ChatIcon from '@material-ui/icons/Chat';
import { Avatar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

function Header() {
    return (
        <div className="header">
            <div className="header__left">
            <p>Companion</p>
                
            </div>
            <div className="header__center">
                {/* <img className="header__logo" src = "https://to-do-cdn.microsoft.com/static-assets/c87265a87f887380a04cf21925a56539b29364b51ae53e089c3ee2b2180148c6/icons/logo.png" alt="app__logo" /> */}
                
            </div>
            

            <div className="header__right">
            <IconButton className = "header__iconBtn">
                    <ChatIcon className="header__chatIcon" />
                </IconButton>
                <Avatar className="profile__image" alt="Mal Pat" src = "no"/>
                <IconButton>
                    <MenuIcon className="header__menuIcon" />
                </IconButton>
                
            </div>
            
        </div>
    )
}

export default Header
