import './App.css';
import Header from './Header/Header';
import MyBoards from './MyBoards/MyBoards';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BoardScreen from './BoardScreen/BoardScreen';
import Login from './AuthScreen/Login';
import SignUp from './AuthScreen/SignUp';

function App() {
  return (
    <div className="App">
      
      <Router>
        <Header/>
        <Switch>
          {/* Sign in  */}
          <Route exact path = "/"> 
            <Login />
          </Route>

          <Route exact path = "/signUp"> 
            <SignUp />
          </Route>

          {/* one particular board */}
          <Route path = "/myboards/:id">
            <BoardScreen />
          </Route>
          
          {/* My boards */}
          <Route path = "/myboards">
            <MyBoards />
          </Route>

          
        </Switch>
      </Router>

    </div>
  );
}

export default App;
