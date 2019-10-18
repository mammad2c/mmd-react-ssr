import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import './styles/App.scss';
import withSSR from './components/withSSR';

const App = ({ routes, initialData }) => {
  return routes ? (
    <div>
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
                React.createElement(withSSR(routeItem.component), {
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
