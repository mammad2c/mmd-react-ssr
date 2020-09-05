/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const shell = require('shelljs');
const configGenerator = require('../webpacks/configGenerator');

let serverStarted = false;

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('AfterServerCompile', () => {
    if (!serverStarted) {
      shell.exec('yarn start-dev-server', {
        async: true,
      });
    }

    serverStarted = true;
  });

  serverCompiler.watch({}, () => {});
}

function compileClient() {
  console.clear();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  const clientDevServer = new devServer(clientCompiler, {
    ...clientConfig.devServer,
    onListening() {
      console.clear();
    },
  });

  clientCompiler.hooks.done.tap('AfterClientCompile', () => {
    if (!serverStarted) {
      compileServer();
    }

    clientDevServer.listen(3001, (err) => {
      console.log('dev serverError: ', err);
    });
  });
}

compileClient();
