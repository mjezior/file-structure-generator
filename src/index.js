#!/usr/bin/env node

(function () {
  'use strict';

  require('module-alias/register');
  const version = require('@root/package.json').version;
  const path = require('path');
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

  const applyRules = require('@utils/apply-rules.util');
  const copyDirectory = require('@utils/copy-directory.util');
  const logger = require('@utils/logger.util');
  const makeDirectory = require('@utils/make-directory.util');
  const resolveValueFromConfig = require('@utils/resolve-value-from-config.util');
  const textCase = require('@utils/text-case.util');

  const configPath = `${process.cwd() + path.sep + (argv.config || 'fsg.conf.js')}`;

  try {
    const config = require(configPath);
    const { type, name } = argv;
    const options = {
      type,
      name,
    };
    const configItem = _get(config, options.type);
    const configOptions = resolveValueFromConfig(_get(config, 'options'), {
      valueType: 'options',
    });
    configItem.outputDir = resolveValueFromConfig(configItem.outputDir, {
      valueType: 'outputDir',
    });
    let dirName = configItem.outputDir.path;

    if (!configItem.outputDir.withoutOwnDir) {
      dirName += textCase(configItem.outputDir.case)(options.name);
    }

    makeDirectory(dirName).then(() => {
      const sourceDir = `${configOptions.templateDir}/${options.type}`;
      copyDirectory(sourceDir, dirName).then(() => {
        applyRules(configItem.rules, {
          componentName: options.name,
          basePath: dirName,
          userConfig: config,
          type: options.type,
          options: configOptions,
        });
      });
    });
  } catch(e) {
    logger.log([`Error: Couldn\'t find specified config file (${configPath})!`, 'bgRed']);
  }
})();
