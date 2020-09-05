/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const configGenerator = require('../webpacks/configGenerator');

let serverStarted = false;

// const isProduction = process.env.NODE_ENV === 'production';
function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('AfterServerCompile', () => {
    serverStarted = true;
  });

  serverCompiler.watch({}, () => {});
}

function compileClient() {
  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.hooks.done.tap('AfterClientCompile', () => {
    if (!serverStarted) {
      compileServer();
    }
  });

  const clientDevServer = new devServer(clientCompiler, clientConfig.devServer);

  clientDevServer.listen(3001, (err) => {
    console.log('dev serverError: ', err);
  });
}

compileClient();
