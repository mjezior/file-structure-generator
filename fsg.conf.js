module.exports = {
  options: {
    templateDir: 'generate-files/',
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab'
    }
  },
  filter: {
    outputDir: {
      path: 'demo/filters/'
    },
    rules: [{
      pattern: './**/generate.*.js',
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
        text: 'generated second text'
      }]
    }]
  }
};
