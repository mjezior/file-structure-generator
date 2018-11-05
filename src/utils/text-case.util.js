const _camelCase = require('lodash/camelCase');
const _kebabCase = require('lodash/kebabCase');
const _snakeCase = require('lodash/snakeCase');

const _pascalCase = require('./pascal-case.util');

module.exports = textCase = (caseName) => {
  switch (caseName) {
    case 'kebab':
      return _kebabCase;
    case 'camel':
      return _camelCase;
    case 'snake':
      return _snakeCase;
    case 'pascal':
      return _pascalCase;
    default: 
      return (string) => (string);
  }
};