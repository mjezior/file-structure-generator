const assert = require('assert');
const _replaceMultiple = require('@utils/replace-multiple.util');

describe('replaceMultiple util', function() {
  it('should return empty string for invalid text argument', function() {
    assert.equal(_replaceMultiple(null), '');
    assert.equal(_replaceMultiple(NaN), '');
    assert.equal(_replaceMultiple([]), '');
    assert.equal(_replaceMultiple({}), '');  
    assert.equal(_replaceMultiple(0), '');
    assert.equal(_replaceMultiple(false), '');
  });

  it('should return passed text for invalid replace arguments', function() {
    assert.equal(_replaceMultiple('text'), 'text');
  });

  it('should return replaced text for valid arguments', function() {
    const replacedText = _replaceMultiple(
      'Some nice text that will be replaced.', 
      ['nice', 'replaced'], 
      ['very nice', 'enriched']
    );
    assert.equal(replacedText, 'Some very nice text that will be enriched.');
  });
});
