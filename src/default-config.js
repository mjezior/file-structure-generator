module.exports = {
  options: {
    templateDir: 'generate-files/',
    generatedFile: {
      nameTag: 'generate',
      case: 'kebab',
    },
  },
  outputDir: {
    case: 'kebab',
    withoutOwnDir: false,
  },
  generatedFile: {
    nameTag: 'generate',
    case: 'kebab',
  },
  replace: {
    from: 'generate',
    case: 'kebab',
  },
  generate: {
    marker: 'generate',
    markerWrapper: '//marker',
    keepMarker: true,
    replace: [{
      from: 'generate',
      case: 'kebab',
    }],
  },
};
