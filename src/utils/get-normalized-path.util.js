const path = require('path');

module.exports = getNormalizedPath = (dir, base) => {
  return path.normalize(path.resolve(path.format({dir, base})));
};
