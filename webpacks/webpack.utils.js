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

module.exports = {
  WebpackBeforeBuildPlugin,
  WebpackAfterBuildPlugin
};
