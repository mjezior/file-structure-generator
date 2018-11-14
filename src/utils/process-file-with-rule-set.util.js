const fs = require('fs-extra');

const _first = require('lodash/first');
const _pick = require('lodash/pick');

const deleteFolderRecursive = require('./delete-file-recursive.util');
const getGeneratedFileName = require('./get-generated-file-name.util');
const getProcessedContent = require('./get-processed-content.util');

module.exports = processFileWithRuleSet = (fileName, ruleSet, params) => {
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
      fs.move(fileName, generatedFileName, {
        overwrite: true
      }, (err) => {
        if (err) {
          throw err;
        }
        if (params.isLast) {
          const fileGenerationMarker = '{{generate}}';
          const dirToCleanUp = `${_first(fileName.split(fileGenerationMarker))}${fileGenerationMarker}`;
          deleteFolderRecursive(dirToCleanUp);
        }
      });
    }
  });
  return generatedFileName;
};
