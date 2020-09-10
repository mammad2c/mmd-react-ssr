const webpack = require('webpack');
const chalk = require('chalk');
const cleanBuild = require('./cleanBuild');
const configGenerator = require('../webpacks/configGenerator');

process.env.NODE_ENV = 'production';

let clientBuilt = false;
let serverBuilt = false;

function showBuildSuccess() {
  if (clientBuilt && serverBuilt) {
    console.log(chalk.greenBright('Compiled successfully'));
  }
}

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.run(() => {
    serverBuilt = true;
    showBuildSuccess();
  });
}

function compileClient() {
  console.clear();
  console.log(chalk.greenBright('Start compiling... '));

  cleanBuild();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.run(() => {
    clientBuilt = true;
    showBuildSuccess();
  });
}

compileClient();
compileServer();
