const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = makeDirectory = (dirName) => (
  fs.mkdirs(dirName, null)
    .catch(err => console.error(chalk.bgRed('Error:', err))) // eslint-disable-line no-console
);