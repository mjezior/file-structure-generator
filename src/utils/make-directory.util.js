const fs = require('fs-extra');
const _isFunction = require('lodash/isFunction');

module.exports = makeDirectory = (dirName) => (
  fs.mkdirs(dirName, null)
    .catch(err => console.error(err))
);