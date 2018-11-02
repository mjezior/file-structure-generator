const fs = require('fs-extra');

module.exports = makeDirectory = (dirName) => (
  fs.mkdirs(dirName, null)
    .catch(err => console.error(err)) // eslint-disable-line no-console
);