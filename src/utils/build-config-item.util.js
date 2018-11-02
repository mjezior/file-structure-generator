const _isArray = require('lodash/isArray');
const _isObject = require('lodash/isObject');
const _has = require('lodash/has');
const _forEach = require('lodash/forEach');
const _defaults = require('lodash/defaults');
const _keys = require('lodash/keys');
const _merge = require('lodash/merge');

module.exports = buildConfigItem = (userConfigItem) => {
  const defaultConfigItem = {
    outputDir: {
      case: 'kebab'
    },
    defaultRule: {
      generatedFile: {
        nameTag: 'generate',
        case: 'kebab'
      },
      replace: [{
        from: 'generate',
        case: 'kebab'
      }],
      generate: [{
        marker: '//generate'
      }]
    }
  };
  let configItem = {
    outputDir: _defaults(userConfigItem.outputDir, defaultConfigItem.outputDir)
  };

  if (_has(userConfigItem, 'rules') && _isArray(userConfigItem.rules)) {
    configItem.rules = [];
    _forEach(userConfigItem.rules, (userRule) => {
      const rule = userRule;
      _forEach(_keys(defaultConfigItem.defaultRule), (ruleName) => {
        if (_has(userRule, ruleName)) {
          if (_isArray(userRule[ruleName])) {
            const ruleItems = [];
            _forEach(userRule[ruleName], (userRuleItem) => {
              ruleItems.push(_defaults(userRuleItem, defaultConfigItem.defaultRule[ruleName][0]));
            });
            rule[ruleName] = ruleItems;
          } else if (_isObject(userRule[ruleName])) {
            rule[ruleName] = _merge(defaultConfigItem.defaultRule[ruleName], userRule[ruleName]);
          }
        }
      });
      configItem.rules.push(rule);
    });
  }

  return configItem;
};