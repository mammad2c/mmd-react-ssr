const webpack = require('webpack');
const chalk = require('chalk');
const cleanBuild = require('./cleanBuild');
const configGenerator = require('../webpacks/configGenerator');

process.env.NODE_ENV = 'production';

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.run(() => {});
}

function compileClient() {
  console.clear();
  console.log(chalk.greenBright('Start compiling... '));

  cleanBuild();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.run(() => {});
}

compileClient();
compileServer();
