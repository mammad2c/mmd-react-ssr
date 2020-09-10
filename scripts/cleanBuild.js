const rm = require('rimraf');

function cleanBuild() {
  rm.sync('./build');
}

module.exports = cleanBuild;
