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
      case: 'kebab',
      withoutOwnDir: false
    },
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab'
    },
    rules: [{
      pattern: 'index.js',
      generatedFile: {
        nameTag: 'generate',
        case: 'kebab'
      },
      replace: [{
        from: 'generateComponentPascal',
        to: 'test1',
        case: 'pascal'
      }, {
        from: 'generateComponentCamel',
        to: 'test2',
        case: 'camel'
      }, {
        from: 'generateTag',
        to: 'test3',
        case: 'kebab'
      }],
      generate: [{
        marker: 'generateMarker',
        markerWrapper: '//marker',
        text: 'console.log(\'and here you have {{generate}} component :)\');',
        keepMarker: true,
        replace: [{
          from: 'generate',
          to: 'test',
          case: 'kebab'
        }]
      }]
    }]
  }
};
