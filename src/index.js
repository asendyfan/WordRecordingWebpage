import React from 'react';
import ReactDOM from 'react-dom';

import Home from './js/router/Home';
import Login from './js/router/Login';
import WordRecords from './js/router/WordRecords';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './css/index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router>
    <div>
        <Route exact path="/" component={Home}></Route>
        <Route path='/login' component={Login}></Route>
        <Route path='/WordRecords' component={WordRecords}></Route>
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();