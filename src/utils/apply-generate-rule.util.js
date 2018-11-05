const escapeStringRegexp = require('escape-string-regexp');

const _forEach = require('lodash/forEach');
const _isArray = require('lodash/isArray');

const applyReplaceRule = require('./apply-replace-rule.util');
const resolveValueFromConfig = require('./resolve-value-from-config.util');

module.exports = applyGenerateRule = (content, rule, componentName) => {
  const ruleConfig = resolveValueFromConfig(rule, {
    valueType: 'generate'
  });
  let generateText = ruleConfig.text;
  if (_isArray(ruleConfig.replace)) {
    _forEach(ruleConfig.replace, (replaceRule) => {
      const replaceRuleConfig = resolveValueFromConfig(replaceRule, {
        valueType: 'replace'
      });
      generateText = applyReplaceRule(generateText, replaceRuleConfig, componentName);
    });
  }
  if (ruleConfig.keepMarker) {
    generateText += '\n' + ruleConfig.markerWrapper.replace('marker', ruleConfig.marker);
  }
  const markerRegexString = escapeStringRegexp(ruleConfig.markerWrapper.replace('marker', ruleConfig.marker));
  content = content.replace(
    new RegExp(markerRegexString, 'g'),
    generateText
  );
  return content;
};
