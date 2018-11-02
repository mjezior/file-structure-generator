const fs = require('fs-extra');

module.exports = copyDirectory = (sourceDir, destDir) => (
  fs.copy(sourceDir, destDir)
    .catch(err => console.error(err)) // eslint-disable-line no-console
);