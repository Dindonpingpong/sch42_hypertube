import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from './login/Login';
import NotFound from './notFound';

export function Main() {

    return(
        <div>
            <Router>
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        </div>
    )
}