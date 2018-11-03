module.exports = {
  options: {
    templateDir: 'generate-files/',
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab'
    }
  },
  default: {
    outputDir: {
      path: 'demo/default/'
    },
    rules: [{
      pattern: 'index.js',
      replace: [{
        from: 'generateComponentPascal',
        case: 'pascal'
      }, {
        from: 'generateComponentCamel',
        case: 'camel'
      }, {
        from: 'generateTag',
        case: 'kebab'
      }],
      generate: [{
        marker: 'generateMarker',
        text: 'console.log(\'and here you are :)\');',
        keepMarker: true
      }]
    }]
  }
};
