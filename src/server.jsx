import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import cors from 'cors';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import path from 'path';
import App from './App';
import routes from './routes';

// eslint-disable-next-line import/no-unresolved
const assets = path.resolve('./build/assets.json');

const extractor = new ChunkExtractor({ statsFile: assets });

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
      const context = {};

      const jsx = extractor.collectChunks(
        <StaticRouter location={req.url} context={context}>
          <App routes={routes} initialData={data} />
        </StaticRouter>
      );

      const html = renderToString(jsx);

      if (context.url) {
        res.redirect(context.url);
      } else {
        const helmet = Helmet.renderStatic();

        res.status(context.statusCode || 200).send(`
          <!DOCTYPE html>
          <html ${helmet.htmlAttributes.toString()}>
            <head>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta charSet='utf-8' />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${extractor.getLinkTags()}
              ${extractor.getStyleTags()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
              <div id="app">${html}</div>
              <script>window.INITIAL_DATA = ${serialize(data, {
                isJSON: true
              })};</script>
              ${extractor.getScriptTags()}
            </body>
          </html>`);
      }
    })
    .catch(error => {
      console.log('error', error.message);
      res.status(500).json({ error: error.message, stack: error.stack });
    });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

if (module.hot) {
  module.hot.accept();
}
