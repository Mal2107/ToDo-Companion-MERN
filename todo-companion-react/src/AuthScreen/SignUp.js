import {React , useState} from 'react'
import './Login.css';
import {Link,useHistory} from 'react-router-dom';
import axios from '../axios.js';
import Header from '../Header/Header';

function SignUp() {
    const [userName, setuserName] = useState("");
    const [pwd, setpwd] = useState("");
    const [authErr, setauthErr] = useState("");

    const history = useHistory();

    const updateUserName = (e) =>{
        setuserName(e.target.value);
    }

    const updatePwd = (e) =>{
        setpwd(e.target.value);
    }

    const signUp = async (e) =>{
        e.preventDefault();
        try{
            const res = await axios.post('/signUp',{
                "userName":userName,
                "pwd":pwd
            });
            console.log(res);
            if(res.data.authStatus===2){
                console.log("User name is taken");
                setauthErr("User name is taken!!");
            }else{
                history.push({
                    pathname: '/myBoards',
                    state: { userUid: res.data[0]._id, userName:userName }
                });
            }
        }catch(e){
            console.log("Http request failed")
        }
    }
    return (
        <div className="login">
            <Header />
            <div className="login__signIn">
                <form>
                    <h1>Sign Up </h1>
                    <div className = "signIn__fields">
                        <input onChange={updateUserName} value={userName} className="signIn__Inputs" type="text" placeholder="Username.."/>
                        <input onChange={updatePwd} value={pwd} className="signIn__Inputs" type="password" placeholder="Password..."/>
                        <h3>{authErr}</h3>
                        <button onClick={signUp} className="signIn__btn" type="submit"> Sign UP </button>
                    </div>
                    <div className="other__auth">
                        <Link to = '/'>
                            <p>Sign In</p>
                        </Link>
                    </div>
                </form>
            </div>  
        </div>
    )
};

export default SignUp
