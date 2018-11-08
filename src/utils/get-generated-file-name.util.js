const escapeStringRegexp = require('escape-string-regexp');

const replaceMultiple = require('./replace-multiple.util');
const resolveValueFromConfig = require('./resolve-value-from-config.util');
const textCase = require('./text-case.util');

module.exports = getGeneratedFileName = (fileName, ruleSet, params) => {
  const generatedFileConfig = resolveValueFromConfig(params.userConfig, {
    valueType: 'generatedFile',
    ...params,
  });
  let pathPattern = escapeStringRegexp(`{{${generatedFileConfig.nameTag}}}`);
  pathPattern = replaceMultiple(pathPattern, [/\\\*/g, /\\\{/g, /\\\}/g], ['.*', '{', '}']);
  return fileName.replace(
    new RegExp(pathPattern, 'g'),
    textCase(generatedFileConfig.case)(params.componentName)
  );
};
