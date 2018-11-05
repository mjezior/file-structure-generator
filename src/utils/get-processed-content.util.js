const _forEach = require('lodash/forEach');

const applyGenerateRule = require('./apply-generate-rule.util');
const applyReplaceRule = require('./apply-replace-rule.util');

module.exports = getProcessedContent = (data, ruleSet, componentName) => {
  let processedContent = data;
  _forEach(ruleSet, (rulesItems, ruleKey) => {
    _forEach(rulesItems, (rule) => {
      switch (ruleKey) {
        case 'replace': {
          processedContent = applyReplaceRule(processedContent, rule, componentName);
          break;
        }
        case 'generate': {
          processedContent = applyGenerateRule(processedContent, rule, componentName);
          break;
        }
      }
    });
  });
  return processedContent;
};
