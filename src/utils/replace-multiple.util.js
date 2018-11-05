const _forEach = require('lodash/forEach');
const _isArray = require('lodash/isArray');
const _isString = require('lodash/isString');

module.exports = replaceMultiple = (text, baseArray, replaceArray) => {
  let replacedText = _isString(text) ? text : '';
  const areArrays = _isArray(baseArray) && _isArray(replaceArray);
  const hasSameDims = areArrays && baseArray.length === replaceArray.length;

  if (areArrays && hasSameDims) {
    _forEach(baseArray, (item, index) => {
      replacedText = replacedText.replace(item, replaceArray[index]);
    });
  }

  return replacedText;
};