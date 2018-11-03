const assert = require('assert');
const _textCase = require('@utils/text-case.util');

const _nonCase = _textCase();
const _camelCase = _textCase('camel');
const _kebabCase = _textCase('kebab');
const _pascalCase = _textCase('pascal');

describe('textCase util', function() {
  it('should return dummy function when not found appropiate one', function() {
    assert.equal(_nonCase('sOmE-VArio_us cAsed STR_ING'), 'sOmE-VArio_us cAsed STR_ING');
  });

  it('should return camelCase function', function() {
    assert.equal(_camelCase('sOmE-VArio_us cAsed STR_ING'), 'sOmEVArioUsCAsedStrIng');
  });

  it('should return kebabCase function', function() {
    assert.equal(_kebabCase('sOmE-VArio_us cAsed STR_ING'), 's-om-e-v-ario-us-c-ased-str-ing');
  });  
  
  it('should return pascalCase function', function() {
    assert.equal(_pascalCase('sOmE-VArio_us cAsed STR_ING'), 'SOmEVArioUsCAsedStrIng');
  });
});
