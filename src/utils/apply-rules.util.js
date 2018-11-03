const fs = require('fs-extra');
const path = require('path');
const klaw = require('klaw');
const through2 = require('through2');
const escapeStringRegexp = require('escape-string-regexp');

const _forEach = require('lodash/forEach');
const _filter = require('lodash/filter');
const _pickBy = require('lodash/pickBy');
const _includes = require('lodash/includes');

const textCase = require('./text-case.util');
const replaceMultiple = require('./replace-multiple.util');

function getProcessedContent(data, ruleSet, componentName) {
  let processedContent = data;
  _forEach(ruleSet, (rulesItems, ruleKey) => {
    _forEach(rulesItems, (rule) => {
      switch (ruleKey) {
        case 'replace':
          const replaceText = textCase(rule.case)(rule.to || componentName);
          processedContent = processedContent.replace(
            new RegExp(escapeStringRegexp(`{{${rule.from}}}`), 'g'),
            replaceText
          );
          break;
        case 'generate':
          const generateText = rule.text + '\n//' + rule.marker;
          processedContent = processedContent.replace(
            new RegExp(escapeStringRegexp(`//${rule.marker}`), 'g'),
            generateText
          );
          break;
      }
    });
  });
  return processedContent;
}

function processFileWithRuleSet(fileName, ruleSet, params) {
  const { generatedFile } = ruleSet;
  ruleSet = _pickBy(ruleSet, (rule, ruleKey) => (
    !_includes(['pattern', 'generatedFile'], ruleKey)
  ));
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err)  {
      throw err;
    }
    const processedContent = getProcessedContent(data, ruleSet, params.componentName);
    fs.writeFileSync(fileName, processedContent, 'utf8');
    if (params.renameFile) {
      const generatedNameTag = generatedFile.nameTag || params.options.generatedFile.nameTag;
      const generatedNameCase = generatedFile.case || params.options.generatedFile.case;
      const newFileName = fileName.replace(
        generatedNameTag,
        textCase(generatedNameCase)(params.componentName)
      );
      fs.rename(fileName, newFileName, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
}

function getNormalizedPath(dir, base) {
  return path.normalize(path.resolve(path.format({dir, base})));
}

function getMatchingItems(basePath, items, ruleSet) {
  let pathPattern = escapeStringRegexp(getNormalizedPath(basePath, ruleSet.pattern));
  pathPattern = replaceMultiple(pathPattern,
    [/\\\*/g, /\\\(/g, /\\\)/g, /\\\|/g],
    ['.*', '(', ')', '|']
  );
  return _filter(items, (item) => (
    new RegExp(pathPattern).test(path.normalize(item))
  ));
}

function applyRuleSet(ruleSet, params) {
  const matchingItems = getMatchingItems(params.basePath, params.items, ruleSet);
  _forEach(matchingItems, (matchingItem) => {
    processFileWithRuleSet(
      matchingItem,
      ruleSet, {
        componentName: params.componentName,
        options: params.options,
        renameFile: _includes(params.itemsToRename, matchingItem),
      },
    );
  });
}

function handleFileProcessing(items, rulesSets, params) {
  const itemsToRename = _filter(items, (item) => (
    item.indexOf(params.options.generatedFile.nameTag) !== -1
  ));
  _forEach(items, (item) => {
    console.log('generated file: ' + item); // eslint-disable-line no-console
  });
  _forEach(rulesSets, (ruleSet) => {
    applyRuleSet(ruleSet, {
      basePath: params.basePath,
      items,
      componentName: params.componentName,
      options: params.options,
      itemsToRename,
    });
  });
}

module.exports = applyRules = (rulesSets, params) => {
  const items = [];
  const excludeDirFilter = through2.obj(function (item, enc, next) {
    if (!item.stats.isDirectory()) {
      this.push(item);
    }
    next();
  });
  klaw(params.basePath)
    .pipe(excludeDirFilter)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      handleFileProcessing(items, rulesSets, params);
    });
};