const _defaultsDeep = require('lodash/defaultsDeep');

const defaultConfig = require('@src/default-config');
const resolveGeneratedFileConfig = require('./resolve-generated-file-config.util');

module.exports = function resolveValueFromConfig(userConfig, params) {
  switch (params.valueType) {
    case 'options':
    case 'outputDir':
    case 'replace':
    case 'generate': {
      return _defaultsDeep(userConfig, defaultConfig[params.valueType]);
    }
    case 'generatedFile': {
      return resolveGeneratedFileConfig(userConfig, {
        type: params.type,
        ruleIndex: params.ruleIndex,
      });
    }
  }
};