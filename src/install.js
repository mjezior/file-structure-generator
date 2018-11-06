(function () {
  'use strict';

  const path = require('path');

  const copyDirectory = require('./utils/copy-directory.util');
  const logger = require('./utils//logger.util');

  const sourceDir = 'generate-files';
  const destDir = `${process.env.INIT_CWD + path.sep}.fsg`;

  copyDirectory(sourceDir, destDir).then(() => {
    logger.log('Installed local', ['.fsg', 'bold'], 'directory.');
    logger.log('Please see', ['.fsg/fsg.conf.js', 'bold'], 'for reference.');
  });
})();