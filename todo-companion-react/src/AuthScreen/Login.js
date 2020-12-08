import {React , useState} from 'react'
import './Login.css';
import {Link, useHistory} from 'react-router-dom';
import axios from '../axios.js';
import Header from '../Header/Header';

export default function Login() {

    const [userName, setuserName] = useState("");
    const [pwd, setpwd] = useState("");
    const [authErr, setauthErr] = useState("");

    const history = useHistory();

    const updateUserName = (e) =>{
        setuserName(e.target.value);
    }

    const updatePwd = (e) =>{
        setpwd(e.target.value);
        console.log(pwd);
    }

    const signIn = async (e) =>{
        e.preventDefault();
        console.log("Executing sign in");
        try{
            const res = await axios.post('/signIn',{
                "userName":userName,
                "pwd":pwd
            });
            if(res.data.length>0){
                console.log(res);
                setauthErr("");
                console.log(res.data[0]._id);
                history.push({
                    pathname: '/myBoards',
                    state: { userUid: res.data[0]._id, userName:userName }
                });
            }else{
                setauthErr("Try again!!");
                console.log("Try again");
            }
            
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className="login">
            <Header />
            <div className="login__signIn">
                <form>
                    <h1>Sign In </h1>
                    <div>
                        <form className="signIn__fields">
                            <input onChange={updateUserName} value={userName} className="signIn__Inputs" type="text" placeholder="Username.."/>
                            <input onChange={updatePwd} value={pwd} className="signIn__Inputs" type="password" placeholder="Password..."/>
                            <h3>{authErr}</h3>
                            <button onClick={signIn} className="signIn__btn" type="submit"> SignIn </button>
                        </form>
                    </div>
                    
                    <div className="other__auth">
                        <Link to = '/signUp'>
                            <p>Sign Up</p>
                        </Link>
                    </div>
                </form>
            </div>
            
        </div>
    )
}
