import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import routes from './routes';

const data = window.INITIAL_DATA;

hydrate(
  <BrowserRouter>
    <App routes={routes} initialData={data} />
  </BrowserRouter>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
