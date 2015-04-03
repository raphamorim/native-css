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

else
	if (commands.indexOf('--react') > -1)
		return console.log('Conversion to React Style not available yet!')

	return console.log(nativeCSS.convert(commands[2]));