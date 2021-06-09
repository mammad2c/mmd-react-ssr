import { useState } from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter, matchPath } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import App from './App';
import routes from './routes';
import withSSR from './withSSR';

/**
 * you can now get INITIAL_STATE from server here.
 * right now we do nothing with it and just remove it from window in production
 */
const initialData = window.INITIAL_DATA;

if (process.env.NODE_ENV === 'production') {
  delete window.INITIAL_STATE;
  delete window.INITIAL_DATA;
}

const isAsyncComponent = (component) => !!component.load;

/**
 * wrap all routes need to get data from server
 */
const wrappedRoutes = routes.map((item) =>
  isAsyncComponent(item.component)
    ? item
    : {
        ...item,
        component: item.component.getInitialData
          ? withSSR(item.component)
          : item.component,
      }
);

async function allReady() {
  await Promise.all(
    wrappedRoutes.map((route) => {
      const match = matchPath(window.location.pathname, route);
      if (match && route && route.component && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );
}

function Client() {
  const [data, setData] = useState(initialData);

  const resetInitialData = () => {
    if (data && data.length !== 0) {
      setData([]);
    }
  };

  return (
    <BrowserRouter>
      <App
        routes={wrappedRoutes}
        initialData={data}
        resetInitialData={resetInitialData}
      />
    </BrowserRouter>
  );
}

loadableReady(() => {
  allReady().then(() => {
    hydrate(<Client />, document.getElementById('app'));
  });
});

if (module.hot) {
  module.hot.accept();
}
