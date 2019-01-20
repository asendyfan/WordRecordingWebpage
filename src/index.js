import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import Home from './js/router/Home';
import SignIn from './js/router/SignIn';
import WordRecords from './js/router/WordRecords';
import SetWords from './js/router/SetWords';
import SignUp from './js/router/SignUp';
import Forbidden from './js/router/Forbidden';
import Setting from './js/router/Setting';

import {getCookie} from './js/utils/get-cookie';

import './css/index.css';


ReactDOM.render(<Router>
    <div>
        <Route exact path="/" component={Home}></Route>
        <Route path='/signin' component={SignIn}></Route>
        <Route path='/WordRecords' component={WordRecords}></Route>
        <Route path='/signup' component={SignUp}></Route>
        {/* <Route path='/setting' render={()=>getCookie('settingPage').includes('settings')?<Setting/>:<Redirect to='/forbidden'></Redirect>}></Route> */}
        <Route path='/setting' component={Setting}/>
        <Route path='/setWords' component={SetWords}/>
        {/* <Route path='/setWords' render={()=>getCookie('settingPage').includes('setWords')?<SetWords/>:<Redirect to='/forbidden'></Redirect>}></Route> */}
        <Route path='/forbidden' component={Forbidden}></Route>
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();