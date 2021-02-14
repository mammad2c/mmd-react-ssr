/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const devServer = require('webpack-dev-server');

class WebpackErrors extends FriendlyErrorsWebpackPlugin {
  constructor(options) {
    super(options);
    this.noSuccess = true;
    this.shouldClearConsole = false;
  }

  displaySuccess() {
    if (!this.noSuccess) {
      super.displaySuccess();
    }
  }
}

class DevServer extends devServer {
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

const terserPluginOptions = {
  terserOptions: {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      collapse_vars: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      warnings: false,
      dead_code: true,
      evaluate: true,
      inline: 2,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  },
  parallel: true,
  extractComments: false,
};

module.exports = {
  terserPluginOptions,
  DevServer,
  WebpackErrors,
};
