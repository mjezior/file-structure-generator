const klaw = require('klaw');
const through2 = require('through2');

const _find = require('lodash/find');
const _includes = require('lodash/includes');

const handleFileProcessing = require('./handle-file-processing.util');

module.exports = applyRules = (rulesSets, params) => {
  const items = [];
  const excludedDirs = ['.git', '.fsg', 'node_modules', 'bower_components'];
  const excludeFilter = through2.obj(function (item, enc, next) {
    const isInExcludedDir = _find(excludedDirs, (excludedDir) => (
      _includes(item.path, excludedDir)
    ));
    if (!item.stats.isDirectory() && !isInExcludedDir) {
      this.push(item);
    }
    next();
  });
  klaw(params.basePath)
    .pipe(excludeFilter)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      handleFileProcessing(items, rulesSets, params);
    });
};