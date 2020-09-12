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

  serverCompiler.run(() => {
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

  clientCompiler.run(() => {
    clientBuilt = true;
    showBuildSuccess();
  });
}

compileClient();
compileServer();
