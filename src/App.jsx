import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';

// base SASS file
import './styles/App.scss';

const App = ({ routes, initialData, resetInitialData }) => {
  return (
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
              render={(props) =>
                React.createElement(routeItem.component, {
                  ...props,
                  resetInitialData,
                  initialData: (initialData && initialData[index]) || null,
                })
              }
            />
          ))}
        </Switch>
      </main>
    </div>
  );
};

export default App;
