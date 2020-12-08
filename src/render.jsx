/**
 * this file is only for rendering on server
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChunkExtractor } from '@loadable/server';
import path from 'path';
import serialize from 'serialize-javascript';
import App from './App';
import routes from './routes';

/**
 * @param {object} data initial data resolved by getInitialData in components
 * @param {ExpressRequest} req Express js request object
 * @param {ExpressResponse} res ExpressJs response object
 * @param {object} preloadedState preloaded state or other configuration, example usage: redux
 */
const render = (data, req, res, preloadedState = {}) => {
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('./build/assets.json'),
  });

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

    /**
     * if you configured store, such as redux, replace INITIAL_STATE value by: 
     * ${serialize(store.getState(), {
              isJSON: true
        })}
     */
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
              <script>
                window.INITIAL_STATE =  ${serialize(preloadedState, {
                  isJSON: true,
                })};
              </script>
              <script>
                window.INITIAL_DATA = ${serialize(data, {
                  isJSON: true,
                })};
              </script>
              ${extractor.getScriptTags()}
            </body>
          </html>`);
  }
};

export default render;
