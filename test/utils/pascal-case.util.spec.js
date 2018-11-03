const assert = require('assert');
const _pascalCase = require('@utils/pascal-case.util');

describe('pascalCase util', function() {
  it('should return empty string when passed empty string', function() {
    assert.equal(_pascalCase(''), '');
  });

  it('should return pascal cased text for valid text', function() {
    assert.equal(_pascalCase('TestCase'), 'TestCase');
    assert.equal(_pascalCase('test-case'), 'TestCase');
    assert.equal(_pascalCase('testCase'), 'TestCase');
    assert.equal(_pascalCase('test_case'), 'TestCase');
    assert.equal(_pascalCase('TEST_CASE'), 'TestCase');
    assert.equal(_pascalCase('TEST-CASE'), 'TestCase');
    assert.equal(_pascalCase(3), '3');
  });

  it('should return string for non-string value', function() {
    assert.equal(_pascalCase(null), '');
    assert.equal(_pascalCase(NaN), 'NaN');
    assert.equal(_pascalCase([]), '');
    assert.equal(_pascalCase({}), 'ObjectObject');  
    assert.equal(_pascalCase(0), '0');
    assert.equal(_pascalCase(false), 'False');
  });
});
