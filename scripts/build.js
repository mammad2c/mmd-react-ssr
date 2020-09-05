/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const configGenerator = require('../webpacks/configGenerator');

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.run(() => {});
}

function compileClient() {
  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.run(() => {});
}

compileClient();
compileServer();
