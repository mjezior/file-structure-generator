const fs = require('fs-extra');

const logger = require('./logger.util');

module.exports = copyDirectory = (sourceDir, destDir) => (
  fs.copy(sourceDir, destDir)
    .catch(err => logger.log([`Error: ${err}`, 'bgRed']))
);
