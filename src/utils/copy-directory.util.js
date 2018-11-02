const fs = require('fs-extra');
const _isFunction = require('lodash/isFunction');

module.exports = copyDirectory = (sourceDir, destDir) => (
  fs.copy(sourceDir, destDir)
    .catch(err => console.error(err))
);