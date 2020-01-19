/* eslint-disable max-classes-per-file */
class WebpackAfterBuildPlugin {
  constructor(callback) {
    this.callback = callback;
  }

  apply(compiler) {
    compiler.hooks.done.tap('buildDone', this.callback);
  }
}

class WebpackBeforeBuildPlugin {
  constructor(callback) {
    this.callback = callback;
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('beforeBuild', this.callback);
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
      warnings: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
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
  sourceMap: false,
  cache: true,
  parallel: true,
  extractComments: false
};

module.exports = {
  WebpackBeforeBuildPlugin,
  WebpackAfterBuildPlugin,
  terserPluginOptions
};
