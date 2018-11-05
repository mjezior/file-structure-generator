const resolveValueFromConfig = require('./resolve-value-from-config.util');
const textCase = require('./text-case.util');

module.exports = getGeneratedFileName = (fileName, ruleSet, params) => {
  const generatedFileConfig = resolveValueFromConfig(params.userConfig, {
    valueType: 'generatedFile',
    ...params,
  });
  return fileName.replace(
    generatedFileConfig.nameTag,
    textCase(generatedFileConfig.case)(params.componentName)
  );
};
