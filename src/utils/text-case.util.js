const _kebabCase = require('lodash/kebabCase');
const _camelCase = require('lodash/camelCase');
const _pascalCase = require('./pascal-case.util');

module.exports = textCase = (caseName) => {
  switch (caseName) {
    case 'kebab':
      return _kebabCase;
    case 'camel':
      return _camelCase;
    case 'pascal':
      return _pascalCase;
  }
};