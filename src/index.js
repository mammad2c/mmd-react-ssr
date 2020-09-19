/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import http from 'http';
import messages from '../scripts/messages';

let app = require('./server.js').default;

const server = http.createServer(app);

let currentApp = app;

server
  .listen(process.env.PORT || 3000, () => {
    messages.serverFirstStart();
  })
  .on('error', (error) => {
    console.log(error);
  });

if (module.hot) {
  module.hot.accept('./server.js', () => {
    messages.hotReloading();

    try {
      app = require('./server.js').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
