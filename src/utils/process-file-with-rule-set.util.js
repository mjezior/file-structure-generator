const fs = require('fs-extra');

const _pick = require('lodash/pick');

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
      fs.rename(fileName, generatedFileName, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
  return generatedFileName;
};
