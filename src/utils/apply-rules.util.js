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

module.exports = applyRules = (componentName, basePath, rulesSets, options) => {
  const items = [];
  const excludeDirFilter = through2.obj(function (item, enc, next) {
    if (!item.stats.isDirectory()) {
      this.push(item)
    }
    next();
  });
  klaw(basePath)
    .pipe(excludeDirFilter)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      const itemsToRename = _filter(items, (item) => (
        item.indexOf(options.generatedFile.nameTag) !== -1
      ));
      _forEach(items, (item) => {
        console.log('generated file: ' + item); // eslint-disable-line no-console
      });
      _forEach(rulesSets, (ruleSet) => {
        const pathPattern = escapeStringRegexp(path.normalize(path.resolve(path.format({
          dir: basePath,
          base: ruleSet.pattern
        }))))
          .replace(/\\\*/g, '.*')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\|/g, '|');
        const matchingItems = _filter(items, (item) => (
          new RegExp(pathPattern).test(path.normalize(item))
        ));
        const { generatedFile } = ruleSet;
        ruleSet = _pickBy(ruleSet, (rule, ruleKey) => (
          !_includes(['pattern', 'generatedFile'], ruleKey)
        ));
        _forEach(matchingItems, (matchingItem) => {
          fs.readFile(matchingItem, 'utf8', (err, data) => {
            if (err)  {
              throw err;
            }
            let processedContent = data;
            _forEach(ruleSet, (rulesItems, ruleKey) => {
              _forEach(rulesItems, (rule) => {
                switch (ruleKey) {
                  case 'replace':
                    const replaceText = textCase(rule.case)(componentName);
                    processedContent = processedContent.replace(new RegExp(escapeStringRegexp(rule.from), 'g'), replaceText);
                    break;
                  case 'generate':
                    const generateText = rule.text + '\n' + rule.marker;
                    processedContent = processedContent.replace(new RegExp(escapeStringRegexp(rule.marker), 'g'), generateText);
                    break;
                }
              });
            });
            fs.writeFileSync(matchingItem, processedContent, 'utf8');
            if (_includes(itemsToRename, matchingItem)) {
              const generatedNameTag = generatedFile.nameTag || options.generatedFile.nameTag;
              const generatedNameCase = generatedFile.case || options.generatedFile.case;
              const newFileName = matchingItem.replace(generatedNameTag, textCase(generatedNameCase)(componentName));
              fs.rename(matchingItem, newFileName, (err) => {
                if (err) {
                  throw err;
                }
              });
            }
          });
        });
      });
    });
};