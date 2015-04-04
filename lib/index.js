'use strict';

var nativeCSS = require('./native-css'),
    verify = require('../src').verify,
    commands = process.argv;

// Version
if (verify(['-v', '--version']))
    return console.log(nativeCSS.version());

// Help
else if (verify(['-h', '--help'])) 
    return console.log(nativeCSS.help());

// Native
else {
	var react = (commands.indexOf('--react') > -1),
		outputPath = commands[3] || false;

	var css = nativeCSS.convert(commands[2]);

	return nativeCSS.generateFile(css, outputPath, react);
}