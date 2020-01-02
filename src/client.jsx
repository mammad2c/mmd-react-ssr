import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter, matchPath } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import App from './App';
import routes from './routes';

const data = window.INITIAL_DATA;
delete window.INITIAL_DATA;

async function allReady() {
  await Promise.all(
    routes.map(route => {
      const match = matchPath(window.location.pathname, route);
      if (match && route && route.component && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );
}

loadableReady(() => {
  allReady().then(() => {
    hydrate(
      <BrowserRouter>
        <App routes={routes} initialData={data} />
      </BrowserRouter>,
      document.getElementById('app')
    );
  });
});

if (module.hot) {
  module.hot.accept();
}
