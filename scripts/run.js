const webpack = require('webpack');
const cluster = require('cluster');
const cleanBuild = require('./cleanBuild');
const { DevServer } = require('../webpacks/webpack.utils');
const configGenerator = require('../webpacks/configGenerator');
const messages = require('./messages');

process.env.NODE_ENV = 'development';

let serverStarted = false;

function compileClient() {
  console.clear();
  messages.compileStart();

  cleanBuild();

  const clientConfig = configGenerator('client');
  const serverConfig = configGenerator('server');

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const clientDevServer = new DevServer(clientCompiler, clientConfig.devServer);

  clientCompiler.hooks.done.tap('ClientDone', (clientStats) => {
    if (clientStats.hasErrors()) {
      return;
    }

    if (!serverStarted) {
      serverCompiler.hooks.done.tap('ServerDone', (serverStats) => {
        if (serverStats.hasErrors()) {
          return;
        }

        if (!serverStarted) {
          messages.compileSuccessful();
          messages.typeRs();
        }

        serverStarted = true;
      });

      serverCompiler.watch(
        {
          ignored: /node_modules/,
        },
        () => {}
      );
    }
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('clientDevServer err: ', err.message);
  });
}

if (cluster.isMaster) {
  compileClient();
}
