/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const configGenerator = require('../webpacks/configGenerator');

// const isProduction = process.env.NODE_ENV === 'production';
function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.run(() => {});
}

function compileClient() {
  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.hooks.done.tap('AfterClientCompile', () => {
    compileServer();
  });

  clientCompiler.run(() => {});
}

compileClient();
