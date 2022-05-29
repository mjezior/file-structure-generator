const fs = require('fs-extra');

const logger = require('./logger.util');

module.exports = makeDirectory = (dirName) => (
  /* TODO: JSFIX could not patch the breaking change:
  Creating a directory with fs-extra no longer returns the path 
  Suggested fix: The returned promise no longer includes the path of the new directory */
  fs.mkdirs(dirName, null)
    .catch(err => logger.log([`Error: ${err}`, 'bgRed']))
);
