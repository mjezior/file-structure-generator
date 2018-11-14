const fs = require('fs-extra');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      const currentPath = `${path}/${file}`;
      if (fs.statSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = deleteFolderRecursive;
