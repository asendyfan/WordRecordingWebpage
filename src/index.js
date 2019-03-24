import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
// import SetWords from './js/router/WordRecord/SetWords';

// import WordRecords from './js/router/WordRecords';
// import SignIn from './js/router/SignIn';
// import SignUp from './js/router/SignUp';
// import Forbidden from './js/router/Forbidden';
// import Setting from './js/router/Setting';

import "antd/dist/antd.css";
import 'antd/dist/antd.less';
import './css/index.css';

import asyncComponent from './js/utils/AsyncComponents'

const AsyncWordRecords = asyncComponent(()=>import('./js/router/WordRecords'))
const AsyncSignIn = asyncComponent(()=>import('./js/router/SignIn'))
const AsyncSignUp = asyncComponent(()=>import('./js/router/SignUp'))
const AsyncForbidden = asyncComponent(()=>import('./js/router/Forbidden'))
const AsyncSetting = asyncComponent(()=>import('./js/router/Setting'))



ReactDOM.render(<Router>
    <div>
        <Route exact path='/' component={AsyncWordRecords}></Route>
        <Route path='/signin' component={AsyncSignIn}></Route>
        <Route path='/signup' component={AsyncSignUp}></Route>
        {/* <Route path='/setting' render={()=>getCookie('settingPage').includes('settings')?<Setting/>:<Redirect to='/forbidden'></Redirect>}></Route> */}
        <Route path='/setting' component={AsyncSetting}/>
        {/* <Route path='/setWords' component={SetWords}/> */}
        {/* <Route path='/setWords' render={()=>getCookie('settingPage').includes('setWords')?<SetWords/>:<Redirect to='/forbidden'></Redirect>}></Route> */}
        <Route path='/forbidden' component={AsyncForbidden}></Route>
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();