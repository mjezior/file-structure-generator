const _forEach = require('lodash/forEach');
const _includes = require('lodash/includes');

const getMatchingItems = require('./get-matching-items.util');
const processFileWithRuleSet = require('./process-file-with-rule-set.util');

module.exports = applyRuleSet = (ruleSet, params) => {
  const matchingItems = getMatchingItems(params.basePath, params.items, ruleSet);
  const generatedFiles = [];
  _forEach(matchingItems, (matchingItem, index) => {
    const generatedFile = processFileWithRuleSet(
      matchingItem,
      ruleSet, {
        ...params,
        renameFile: _includes(params.itemsToRename, matchingItem),
        isLast: index === (matchingItems.length - 1),
      },
    );
    generatedFiles.push(generatedFile);
  });
  return generatedFiles;
};
