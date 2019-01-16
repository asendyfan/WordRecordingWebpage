import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import Home from './js/router/Home';
import Login from './js/router/Login';
import WordRecords from './js/router/WordRecords';
import SignUp from './js/router/SignUp';

import './css/index.css';

ReactDOM.render(<Router>
    <div>
        <Route exact path="/" component={Home}></Route>
        <Route path='/login' component={Login}></Route>
        <Route path='/WordRecords' component={WordRecords}></Route>
        <Route path='/signup' component={SignUp}></Route>
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();