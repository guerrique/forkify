// includes a node module called path
const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    // has to be an absolute path here - we use the method from the path module
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'bundle.js'
  },
  mode: 'development' /* will be as fast as possible and not compress our code during development
};
