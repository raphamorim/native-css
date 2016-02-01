'use strict';

var nativeCSS = require('./native-css'),
	verify = require('../lib').verify,
	commands = process.argv,
	async = false;

if (verify(['-v', '--version']))
	console.log(nativeCSS.version());

else if (verify(['-h', '--help']))
	console.log(nativeCSS.help());
else if (verify(['-p','--async']))
	async = true;

else {
	var react = (commands.indexOf('--react') > -1),
		outputPath = commands[3] || false;

	if (!async) {
		var css = nativeCSS.convert(commands[2]);
		if (outputPath)
			nativeCSS.generateFile(css, outputPath, react);
		else
			console.log(css);

	}
	else {
		nativeCSS.convertAsync(commands[2])
			.then(function(css) {
				if (outputPath)
					nativeCSS.generateFile(css, outputPath, react);
				else
					console.log(css);
			});
	}

}
