module.exports = {
  options: {
    templateDir: '.fsg/',
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab'
    }
  },
  default: {
    outputDir: {
      path: 'demo/default/',
      withoutOwnDir: false
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
        markerWrapper: '//marker',
        text: 'console.log(\'and here you are :)\');',
        keepMarker: true
      }]
    }]
  }
};
