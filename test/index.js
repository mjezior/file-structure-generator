const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAliases({
  '@utils': path.resolve(__dirname + '/../src/utils')
});
require('./utils/index');
