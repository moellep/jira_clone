import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate">
        <Authenticate />
      </Route>
      <Route path="/project">
        <Project />
      </Route>
      <Route>
        <PageError />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
