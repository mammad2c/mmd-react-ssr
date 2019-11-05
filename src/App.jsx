import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';
import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';

// base SASS file
import './styles/App.scss';

setConfig({
  trackTailUpdates: false
});

const App = ({ routes, initialData }) => {
  return routes ? (
    <div>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <header className="site-header">
        <NavLink to="/" exact>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/projects"> Projects </NavLink>
      </header>
      <main className="main-site">
        <Switch>
          {routes.map((routeItem, index) => (
            <Route
              key={routeItem.path}
              path={routeItem.path}
              exact={routeItem.exact}
              render={props =>
                React.createElement(routeItem.component, {
                  ...props,
                  initialData: (initialData && initialData[index]) || null
                })
              }
            />
          ))}
        </Switch>
      </main>
    </div>
  ) : null;
};

export default hot(App);
