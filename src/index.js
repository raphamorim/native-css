'use strict';

var nativeCSS = require('./native-css'),
  verify = require('../lib').verify,
  commands = process.argv;

if (verify(['-v', '--version']))
  console.log(nativeCSS.version());

else if (verify(['-h', '--help']))
  console.log(nativeCSS.help());

else {
  var react = (commands.indexOf('--react') > -1),
    outputPath = commands[3] || false;

  var css = nativeCSS.convert(commands[2]);

  nativeCSS.generateFile(css, outputPath, react);
}
