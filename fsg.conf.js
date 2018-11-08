module.exports = {
  options: {
    templateDir: 'generate-files/',
    generatedFile: {
      nameTag: 'generate',
      case: 'camel'
    }
  },
  filter: {
    outputDir: {
      path: 'demo/filters/'
    },
    generatedFile: {
      nameTag: 'generate',
      case: 'snake'
    },
    rules: [{
      pattern: './**/{{generate}}.*.js',
      generatedFile: {
        nameTag: 'generate',
        case: 'pascal'
      },
      replace: [{
        case: 'kebab'
      }]
    }, {
      pattern: '(./**/index.js)|(index.js)',
      replace: [{
        from: 'generateTest',
        case: 'camel'
      }, {
        from: 'generateCamel',
        case: 'camel'
      }, {
        from: 'generateKebab',
        case: 'kebab'
      }],
      generate: [{
        marker: 'generateFirst',
        text: 'generated first text'
      }, {
        marker: 'generateSecond',
        markerWrapper: '<!-- marker -->',
        text: 'generated {{generate}} text',
        replace: [{
          from: 'generate',
          case: 'pascal'
        }]
      }]
    }]
  }
};
