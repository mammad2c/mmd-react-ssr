const webpack = require('webpack');
const cleanBuild = require('./cleanBuild');
const { DevServer } = require('../webpacks/webpack.utils');
const configGenerator = require('../webpacks/configGenerator');
const messages = require('./messages');

process.env.NODE_ENV = 'development';

let serverStarted = false;

function compile() {
  console.clear();
  messages.compileStart();

  cleanBuild();

  const clientConfig = configGenerator('client');
  const serverConfig = configGenerator('server');

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  const clientDevServer = new DevServer(clientCompiler, clientConfig.devServer);

  clientCompiler.hooks.done.tap('ClientDone', (clientStats) => {
    if (serverStarted) {
      return;
    }

    if (clientStats.hasErrors()) {
      messages.compileError();
      return;
    }

    serverCompiler.hooks.done.tap('ServerDone', (serverStats) => {
      if (serverStarted) {
        return;
      }

      if (serverStats.hasErrors()) {
        messages.compileError();
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
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('clientDevServer err: ', err.message);
  });
}

compile();
