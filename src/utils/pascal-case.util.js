const _camelCase = require('lodash/camelCase');

module.exports = pascalCase = (text) => {
  const camelCaseText = _camelCase(text);
  return camelCaseText.charAt(0).toUpperCase() + camelCaseText.substring(1);
};