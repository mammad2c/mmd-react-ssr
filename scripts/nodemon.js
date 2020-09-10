const spawn = require('cross-spawn');
const chalk = require('chalk');

let firstStart = false;

function spawnNodemon() {
  const cp = spawn(
    './node_modules/.bin/nodemon',
    [
      './build/server.js',
      '--watch',
      './build/server.js',
      '--watch',
      './build/assets.json',
    ],
    {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    }
  );

  cp.on('message', (event) => {
    if (event.type === 'start' && !firstStart) {
      console.log(
        `You can type ${chalk.green('rs')} here to manually restart server \n`
      );

      firstStart = true;
    }
  });

  cp.stdout.on('data', (data) => {
    const strData = data.toString();

    if (strData.includes('[nodemon]')) {
      return;
    }

    console.log(data.toString());
  });

  return cp;
}

module.exports = spawnNodemon;
