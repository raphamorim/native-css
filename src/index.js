const nativeCSS = require('./native-css');
const verify = require('../lib').verify;
const commands = process.argv;

if (verify(['-v', '--version']))
    console.log(nativeCSS.version());

else if (verify(['-h', '--help']))
    console.log(nativeCSS.help());

else {
    const react = (commands.indexOf('--react') > -1),
          outputPath = commands[3] || false;

    const css = nativeCSS.convert(commands[2]);

    nativeCSS.generateFile(css, outputPath, react);
}
