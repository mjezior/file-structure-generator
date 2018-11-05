const _defaults = require('lodash/defaults');
const _isUndefined = require('lodash/isUndefined');

const defaultConfig = require('@src/default-config');

module.exports = function resolveGeneratedFileConfig(userConfig, params) {
  const globalConfig = userConfig.options.generatedFile;
  const typeConfig = userConfig[params.type].generatedFile;
  const ruleConfig = !_isUndefined(params.ruleIndex) ?
    userConfig[params.type].rules[params.ruleIndex].generatedFile : {};

  return _defaults({}, ruleConfig, typeConfig, globalConfig, defaultConfig.options.generatedFile);
};
