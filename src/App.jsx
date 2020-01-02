import React, { useEffect } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';

// base SASS file
import './styles/App.scss';

const Header = () => {
  useEffect(() => {
    console.log('salam');
  }, []);

  return (
    <header className="site-header">
      <NavLink to="/" exact>
        Home
      </NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/projects"> Projects </NavLink>
    </header>
  );
};

const App = ({ routes, initialData }) => {
  return routes ? (
    <div>
      <Header />
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

export default App;
