const webpack = require('webpack');
const cluster = require('cluster');
const cleanBuild = require('./cleanBuild');
const ServerRunner = require('./ServerRunner');
const { DevServer } = require('../webpacks/webpack.utils');
const configGenerator = require('../webpacks/configGenerator');
const messages = require('./messages');

process.env.NODE_ENV = 'development';

let serverStarted = false;

const serverRunner = new ServerRunner();

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('ServerDone', (stats) => {
    if (stats.hasErrors()) {
      return;
    }

    if (!serverStarted) {
      messages.compileSuccessful();
      serverRunner.start();
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

function compileClient() {
  console.clear();
  messages.compileStart();

  cleanBuild();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  const clientDevServer = new DevServer(clientCompiler, {
    ...clientConfig.devServer,
  });

  clientCompiler.hooks.done.tap('ClientDone', (stats) => {
    if (stats.hasErrors()) {
      return;
    }

    if (!serverStarted) {
      compileServer();
    } else {
      serverRunner.restart();
    }
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('clientDevServer err: ', err.message);
  });
}

if (cluster.isMaster) {
  compileClient();
}
