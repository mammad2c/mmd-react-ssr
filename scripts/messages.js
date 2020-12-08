const chalk = require('chalk');

module.exports = {
  compileStart: () =>
    console.log(`${chalk.greenBright('Start compiling... ')}`),
  compileSuccessful: () =>
    console.log(`${chalk.greenBright('Compiled successfully')} \n`),
  compileError: (message) =>
    console.log(`${chalk.red(`Error on compile: ${message}`)} \n`),
  serverFirstStart: () =>
    console.log(`Your app ready at ${chalk.green('http://localhost:3000')} \n`),
  typeRs: () =>
    console.log(
      `You can type ${chalk.green('rs')} here to manually restart server \n`
    ),
  hotReloading: () => console.log(chalk.greenBright('hot reloading server')),
};
