const fs = require('fs-extra');
const path = require('path');
const klaw = require('klaw');
const through2 = require('through2');
const escapeStringRegexp = require('escape-string-regexp');
const chalk = require('chalk');

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
          let generateText = rule.text;
          if (rule.keepMarker) {
            generateText += '\n//' + rule.marker;
          }
          const markerRegexString = escapeStringRegexp(rule.markerWrapper.replace('marker', rule.marker));
          processedContent = processedContent.replace(
            new RegExp(markerRegexString, 'g'),
            generateText
          );
          break;
      }
    });
  });
  return processedContent;
}

function getGeneratedFileName(fileName, config, params) {
  const generatedNameTag = config.nameTag || params.options.generatedFile.nameTag;
  const generatedNameCase = config.case || params.options.generatedFile.case;
  return fileName.replace(
    generatedNameTag,
    textCase(generatedNameCase)(params.componentName)
  );
}

function processFileWithRuleSet(fileName, ruleSet, params) {
  const { generatedFile } = ruleSet;
  const generatedFileName = params.renameFile ?
    getGeneratedFileName(fileName, generatedFile, params) : fileName;
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
        renameFile: _includes(params.itemsToRename, matchingItem),
      },
    );
    generatedFiles.push(generatedFile);
  });
  return generatedFiles;
}

function handleFileProcessing(items, rulesSets, params) {
  const itemsToRename = _filter(items, (item) => (
    item.indexOf(params.options.generatedFile.nameTag) !== -1
  ));
  let generatedFiles = [];
  _forEach(rulesSets, (ruleSet) => {
    const processedFiles = applyRuleSet(ruleSet, {
      basePath: params.basePath,
      items,
      componentName: params.componentName,
      options: params.options,
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