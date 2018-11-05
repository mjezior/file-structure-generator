const escapeStringRegexp = require('escape-string-regexp');
const path = require('path');

const _filter = require('lodash/filter');

const getNormalizedPath = require('./get-normalized-path.util');
const replaceMultiple = require('./replace-multiple.util');

module.exports = getMatchingItems = (basePath, items, ruleSet) => {
  let pathPattern = escapeStringRegexp(getNormalizedPath(basePath, ruleSet.pattern));
  pathPattern = replaceMultiple(pathPattern,
    [/\\\*/g, /\\\(/g, /\\\)/g, /\\\|/g],
    ['.*', '(', ')', '|']
  );
  return _filter(items, (item) => (
    new RegExp(pathPattern).test(path.normalize(item))
  ));
};
