(function () {
  'use strict';

  const path = require('path');
  const copyDirectory = require('./utils/copy-directory.util');

  const sourceDir = 'generate-files';
  const destDir = `${process.cwd() + path.sep}.fsg`;

  copyDirectory(sourceDir, destDir).then(() => {
    console.log('installed local .fsg directory'); // eslint-disable-line no-console
  });
})();