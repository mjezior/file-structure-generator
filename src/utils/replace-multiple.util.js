const _forEach = require('lodash/forEach');

module.exports = replaceMultiple = (text, baseArray, replaceArray) => {
  let replacedText = text;
  _forEach(baseArray, (item, index) => {
    replacedText = replacedText.replace(item, replaceArray[index]);
  });
  return replacedText;
};