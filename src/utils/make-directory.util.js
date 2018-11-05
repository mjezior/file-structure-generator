const fs = require('fs-extra');

const logger = require('./logger.util');

module.exports = makeDirectory = (dirName) => (
  fs.mkdirs(dirName, null)
    .catch(err => logger.log([`Error: ${err}`, 'bgRed']))
);
