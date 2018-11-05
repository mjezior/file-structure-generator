const fs = require('fs-extra');
const path = require('path');
const klaw = require('klaw');
const through2 = require('through2');
const escapeStringRegexp = require('escape-string-regexp');
const chalk = require('chalk');

const _forEach = require('lodash/forEach');
const _find = require('lodash/find');
const _filter = require('lodash/filter');
const _pick = require('lodash/pick');
const _includes = require('lodash/includes');
const _isArray = require('lodash/isArray');

const textCase = require('./text-case.util');
const replaceMultiple = require('./replace-multiple.util');
const resolveValueFromConfig = require('./resolve-value-from-config.util');

function applyReplaceRule(content, rule, componentName) {
  const ruleConfig = resolveValueFromConfig(rule, {
    valueType: 'replace'
  });
  const replaceText = textCase(ruleConfig.case)(ruleConfig.to || componentName);
  content = content.replace(
    new RegExp(escapeStringRegexp(`{{${ruleConfig.from}}}`), 'g'),
    replaceText
  );
  return content;
}

function applyGenerateRule(content, rule, componentName) {
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
}

function getProcessedContent(data, ruleSet, componentName) {
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
}

function getGeneratedFileName(fileName, ruleSet, params) {
  const generatedFileConfig = resolveValueFromConfig(params.userConfig, {
    valueType: 'generatedFile',
    type: params.type,
    ruleIndex: params.ruleIndex,
  });
  return fileName.replace(
    generatedFileConfig.nameTag,
    textCase(generatedFileConfig.case)(params.componentName)
  );
}

function processFileWithRuleSet(fileName, ruleSet, params) {
  const generatedFileName = params.renameFile ?
    getGeneratedFileName(fileName, ruleSet, params) : fileName;
  ruleSet = _pick(ruleSet, ['replace', 'generate']);
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err)  {
      throw err;
    }
    const processedContent = getProcessedContent(data, ruleSet, params.componentName);
    fs.writeFileSync(fileName, processedContent, 'utf8');
    if (params.renameFile) {
      fs.rename(fileName, generatedFileName, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
  return generatedFileName;
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
  const generatedFiles = [];
  _forEach(matchingItems, (matchingItem) => {
    const generatedFile = processFileWithRuleSet(
      matchingItem,
      ruleSet, {
        componentName: params.componentName,
        options: params.options,
        userConfig: params.userConfig,
        type: params.type,
        ruleIndex: params.ruleIndex,
        renameFile: _includes(params.itemsToRename, matchingItem),
      },
    );
    generatedFiles.push(generatedFile);
  });
  return generatedFiles;
}

function handleFileProcessing(items, rulesSets, params) {
  const itemsToRename = _filter(items, (item) => (
    item.indexOf(resolveValueFromConfig(params.userConfig, {
      valueType: 'generatedFile',
      type: params.type
    }).nameTag) !== -1
  ));
  let generatedFiles = [];
  _forEach(rulesSets, (ruleSet, ruleIndex) => {
    const processedFiles = applyRuleSet(ruleSet, {
      basePath: params.basePath,
      items,
      componentName: params.componentName,
      options: params.options,
      userConfig: params.userConfig,
      type: params.type,
      ruleIndex,
      itemsToRename,
    });
    generatedFiles = generatedFiles.concat(processedFiles);
  });
  _forEach(generatedFiles, (item) => {
    item = item.substring(item.indexOf(path.normalize(params.basePath)));
    console.log(chalk.white('generated file:'), chalk.bold(item)); // eslint-disable-line no-console
  });
  console.log(chalk.green('Done.')); // eslint-disable-line no-console
}

module.exports = applyRules = (rulesSets, params) => {
  const items = [];
  const excludedDirs = ['.git', '.fsg', 'node_modules', 'bower_components'];
  const excludeFilter = through2.obj(function (item, enc, next) {
    const isInExcludedDir = _find(excludedDirs, (excludedDir) => (
      _includes(item.path, excludedDir)
    ));
    if (!item.stats.isDirectory() && !isInExcludedDir) {
      this.push(item);
    }
    next();
  });
  klaw(params.basePath)
    .pipe(excludeFilter)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      handleFileProcessing(items, rulesSets, params);
    });
};