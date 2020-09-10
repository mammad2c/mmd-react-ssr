const webpack = require('webpack');
const chalk = require('chalk');
const nodemon = require('./nodemon');
const cleanBuild = require('./cleanBuild');
const { DevServer } = require('../webpacks/webpack.utils');
const configGenerator = require('../webpacks/configGenerator');

process.env.NODE_ENV = 'development';

let serverStarted = false;

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('ServerDone', (stats) => {
    if (stats.hasErrors()) {
      return;
    }

    if (!serverStarted) {
      console.log(`${chalk.greenBright('Compiled successfully')} \n`);

      const ndm = nodemon();

      process.stdin.on('data', (data) => {
        if (data.toString().trim() === 'rs') {
          ndm.send('restart');
        }
      });
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
  console.log(`${chalk.greenBright('Start compiling... ')}`);

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
    }
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('dev serverError: ', err);
  });
}

compileClient();
