const webpack = require('webpack');
const cleanBuild = require('./cleanBuild');
const configGenerator = require('../webpacks/configGenerator');
const messages = require('./messages');

process.env.NODE_ENV = 'production';

let clientBuilt = false;
let serverBuilt = false;

function showBuildSuccess() {
  if (clientBuilt && serverBuilt) {
    messages.compileSuccessful();
  }
}

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.run((err) => {
    if (err) {
      messages.compileError(err.message);
      if (err.stack) {
        console.log(err.stack);
      }
      process.exitCode(1);
      throw new Error(err.message);
    }

    serverBuilt = true;
    showBuildSuccess();
  });
}

function compileClient() {
  console.clear();
  messages.compileStart();

  cleanBuild();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  clientCompiler.run((err) => {
    if (err) {
      messages.compileError(err.message);
      if (err.stack) {
        console.log(err.stack);
      }
      throw new Error(err.message);
    }

    clientBuilt = true;
    showBuildSuccess();
  });
}

compileClient();
compileServer();
