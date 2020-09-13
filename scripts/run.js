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

const compiling = new Proxy(
  {
    client: [],
  },
  {
    set: (target, prop, value) => {
      if (value.includes('done')) {
        serverRunner.restart();
      }

      // eslint-disable-next-line no-param-reassign
      target[prop] = value;

      return true;
    },
  }
);

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
    } else if (!compiling.client.includes('start')) {
      serverRunner.restart();
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

  clientCompiler.hooks.beforeCompile.tap('ClientBeforeCompile', () => {
    if (serverStarted) {
      compiling.client = ['start'];
    }
  });

  clientCompiler.hooks.done.tap('ClientDone', (stats) => {
    if (stats.hasErrors()) {
      return;
    }

    if (!serverStarted) {
      compileServer();
    } else if (compiling.client.includes('start')) {
      compiling.client = ['done'];
    } else {
      compiling.client = [...compiling.client, 'done'];
    }
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('clientDevServer err: ', err.message);
  });
}

if (cluster.isMaster) {
  compileClient();
}
