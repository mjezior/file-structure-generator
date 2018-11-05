const path = require('path');

const _filter = require('lodash/filter');
const _forEach = require('lodash/forEach');

const applyRuleSet = require('./apply-rule-set.util');
const logger = require('./logger.util');
const resolveValueFromConfig = require('./resolve-value-from-config.util');

module.exports = handleFileProcessing = (items, rulesSets, params) => {
  const itemsToRename = _filter(items, (item) => (
    item.indexOf(resolveValueFromConfig(params.userConfig, {
      valueType: 'generatedFile',
      ...params,
    }).nameTag) !== -1
  ));
  let generatedFiles = [];
  _forEach(rulesSets, (ruleSet, ruleIndex) => {
    const processedFiles = applyRuleSet(ruleSet, {
      ...params,
      items,
      ruleIndex,
      itemsToRename,
    });
    generatedFiles = generatedFiles.concat(processedFiles);
  });
  _forEach(generatedFiles, (item) => {
    item = item.substring(item.indexOf(path.normalize(params.basePath)));
    logger.log(['generated file:', 'white'], [item, 'bold']);
  });
  logger.log(['Done.', 'green']);
};
