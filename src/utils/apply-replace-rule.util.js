const escapeStringRegexp = require('escape-string-regexp');

const resolveValueFromConfig = require('./resolve-value-from-config.util');
const textCase = require('./text-case.util');

module.exports = applyReplaceRule = (content, rule, componentName) => {
  const ruleConfig = resolveValueFromConfig(rule, {
    valueType: 'replace'
  });
  const replaceText = textCase(ruleConfig.case)(ruleConfig.to || componentName);
  content = content.replace(
    new RegExp(escapeStringRegexp(`{{${ruleConfig.from}}}`), 'g'),
    replaceText
  );
  return content;
};
