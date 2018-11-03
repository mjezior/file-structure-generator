const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = copyDirectory = (sourceDir, destDir) => (
  fs.copy(sourceDir, destDir)
    .catch(err => console.error(chalk.bgRed('Error:', err))) // eslint-disable-line no-console
);