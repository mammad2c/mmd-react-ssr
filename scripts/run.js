/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const nodemon = require('nodemon');
const chalk = require('chalk');
const cleanBuild = require('./cleanBuild');
const configGenerator = require('../webpacks/configGenerator');

process.env.NODE_ENV = 'development';

let serverStarted = false;

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('AfterServerCompile', () => {
    if (!serverStarted) {
      nodemon({
        script: './build/server.js',
        watch: ['./build/server.js', './build/assets.json'],
      });

      nodemon.once('start', () => {
        console.log(
          `You can type ${chalk.green('rs')} here to manually restart server \n`
        );
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
  console.log(chalk.greenBright('Start compiling... '));

  cleanBuild();

  const clientConfig = configGenerator('client');

  const clientCompiler = webpack(clientConfig);

  const clientDevServer = new devServer(clientCompiler, {
    ...clientConfig.devServer,
  });

  clientCompiler.hooks.done.tap('AfterClientCompile', () => {
    if (!serverStarted) {
      console.clear();
      compileServer();
    }
  });

  clientDevServer.listen(3001, (err) => {
    console.log('dev serverError: ', err);
  });
}

compileClient();
