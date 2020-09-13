const chalk = require('chalk');

module.exports = {
  compileStart: () =>
    console.log(`${chalk.greenBright('Start compiling... ')}`),
  compileSuccessful: () =>
    console.log(`${chalk.greenBright('Compiled successfully')} \n`),
  serverFirstStart: () =>
    console.log(`Your app ready at ${chalk.green('http://localhost:3000')} \n`),
  typeRs: () =>
    console.log(
      `You can type ${chalk.green('rs')} here to manually restart server \n`
    ),
  serverRestarted: () =>
    console.log(chalk.cyan('\n ---- Server restarted ---- \n')),
};