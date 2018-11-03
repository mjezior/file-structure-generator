#!/usr/bin/env node

(function () {
  'use strict';

  const version = require('../package.json').version;
  const path = require('path');
  const chalk = require('chalk');
  const argv = require('yargs')
    .usage('Usage: fsg --type=<type> --name=<name> [--config=<config>]')
    .example('fsg --type=filter --name=testFilter', '- generate file structure for filter with name testFilter')
    .alias('c', 'config')
    .alias('t', 'type')
    .alias('n', 'name')
    .alias('h', 'help')
    .alias('v', 'version')
    .describe('c', 'Path to config')
    .describe('t', 'Type of generated file structure')
    .describe('n', 'Name of generated file structure')
    .demandOption(['t', 'n'])
    .help('h')
    .version(version)
    .argv;

  const _get = require('lodash/get');
  const _merge = require('lodash/merge');

  const _textCase = require('./utils/text-case.util');
  const makeDirectory = require('./utils/make-directory.util');
  const copyDirectory = require('./utils/copy-directory.util');
  const buildConfigItem = require('./utils/build-config-item.util');
  const applyRules = require('./utils/apply-rules.util');

  try {
    const configPath = argv.config || 'fsg.conf.js';
    const config = require(`${process.cwd() + path.sep + configPath}`);
    const defaultConfigOptions = {
      generatedFile: {
        nameTag: 'generate',
        case: 'kebab'
      }
    };

    const { type, name } = argv;
    const options = {
      type,
      name,
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
  } catch(e) {
    console.error(chalk.bgRed('Error: Couldn\'t find specified config file!')); // eslint-disable-line no-console
  }
})();
