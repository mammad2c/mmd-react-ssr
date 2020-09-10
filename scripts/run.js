const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const chalk = require('chalk');
const nodemon = require('./nodemon');
const cleanBuild = require('./cleanBuild');
const configGenerator = require('../webpacks/configGenerator');

process.env.NODE_ENV = 'development';

class noStatusDevServer extends devServer {
  constructor(compiler, options = {}, _log) {
    super(compiler, options, _log);
    this.verbose = false;
  }

  showStatus() {
    if (this.verbose) {
      super.showStatus();
    }
  }
}

let serverStarted = false;

function compileServer() {
  const serverConfig = configGenerator('server');

  const serverCompiler = webpack(serverConfig);

  serverCompiler.hooks.done.tap('AfterServerCompile', () => {
    if (!serverStarted) {
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

  const clientDevServer = new noStatusDevServer(clientCompiler, {
    ...clientConfig.devServer,
  });

  clientCompiler.hooks.done.tap('AfterClientCompile', () => {
    if (!serverStarted) {
      console.clear();
      compileServer();
    }
  });

  clientDevServer.listen(clientConfig.devServer.port, (err) => {
    console.log('dev serverError: ', err);
  });
}

compileClient();
