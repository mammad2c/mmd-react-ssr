/* eslint-disable no-console */
import express from 'express';
import { matchPath } from 'react-router-dom';
import cors from 'cors';
import routes from './routes';
import render from './render';

const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.disable('x-powered-by');

app.get('/*', (req, res) => {
  const matches = routes.map(route => {
    const match = matchPath(req.path, route.path, route);
    // We then look for static getInitialData function on each top level component
    const { component } = route;
    if (match) {
      if (!match.isExact && route.exact) {
        return null;
      }

      const obj = {
        route,
        match,
        // eslint-disable-next-line no-nested-ternary
        promise: component.load
          ? component
              .load()
              .then(() => component.getInitialData({ match, req, res }))
          : component.getInitialData
          ? component.getInitialData({ match, req, res })
          : Promise.resolve(null)
      };
      return obj;
    }
    return null;
  });

  if (matches.length === 0) {
    res.status(404).send('Not Found');
  }

  const promises = matches.map(match => (match ? match.promise : null));

  Promise.all(promises)
    .then(data => {
      render(data, req, res);
    })
    .catch(error => {
      console.log('error', error.message);
      res.status(500).json({ error: error.message, stack: error.stack });
    });
});

app.listen(3000, () => {
  console.log('Open browser at http://localhost:3000');
});

if (module.hot) {
  module.hot.accept();
}
