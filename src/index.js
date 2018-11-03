(function () {
  'use strict';

  const grab = require('ps-grab');
  const path = require('path');

  const _get = require('lodash/get');
  const _merge = require('lodash/merge');

  const _textCase = require('./utils/text-case.util');
  const makeDirectory = require('./utils/make-directory.util');
  const copyDirectory = require('./utils/copy-directory.util');
  const buildConfigItem = require('./utils/build-config-item.util');
  const applyRules = require('./utils/apply-rules.util');

  const configPath = grab('--config') || 'fsg.conf.js';
  const config = require(`${process.cwd() + path.sep + configPath}`);
  const defaultConfigOptions = {
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab'
    }
  };

  const options = {
    name: grab('--name'),
    type: grab('--type'),
  };

  const userConfigItem = _get(config, options.type);
  const userConfigOptions = _merge(defaultConfigOptions, _get(config, 'options'));
  const configItem = buildConfigItem(userConfigItem);
  const dirName = configItem.outputDir.path + _textCase(configItem.outputDir.case)(options.name);

  makeDirectory(dirName).then(() => {
    const sourceDir = `${userConfigOptions.templateDir}/${options.type}`;
    copyDirectory(sourceDir, dirName).then(() => {
      applyRules(configItem.rules, {
        componentName: options.name,
        basePath: dirName,
        options: userConfigOptions,
      });
    });
  });
})();
