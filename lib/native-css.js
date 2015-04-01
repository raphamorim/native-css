'use strict';

var packageJson = require('../package.json'),
    src = require('../src');

var nativeCSS = function() {};
    
nativeCSS.prototype.default = function() {
    return src.readFile('/../docs/default.md')
}

nativeCSS.prototype.version = function() {
    return ('native-css version: ' + packageJson.version)
}

nativeCSS.prototype.help = function() {
    return src.readFile('/../docs/help.md')
}

nativeCSS.prototype.convertProperties = function(reference, property) {
    var properties = {};

    property = property.replace(new RegExp(reference + '{', 'g'), '')
                .replace(new RegExp('}', 'g'), '')

    property = property.split(';');

    property.forEach(function(item) {
        if (item != '') {
            var entry = item.split(':');
            properties[entry[0]] = entry[1];
        }
    })

    return properties;
}

nativeCSS.prototype.convert = function(cssFile) {
    var path = process.cwd() + '/' + cssFile;

    console.log(path);

    if (!(require('fs').existsSync(path)))
        return console.log('Ooops!\nError: CSS file not found!');

    var self = this,
        css = src.readFile(path);
        css = css.replace(/\s/g, '');
    
    var classNames = css.match(/(?:#\w+\s+)?\.[\w-]+(?:\s+\w+\s*\.\w+|\s+\w+)?/ig),
        classNamesData = '';

    var classes = [];
    var result = {};

    classNames.forEach(function(item) {
        classNamesData = css
            .substring(css.indexOf(item),css.indexOf('}')+1);

        css = css.replace(classNamesData, '');
        classes.push(classNamesData);

        result[item] = self.convertProperties(item, classNamesData);
    });

    console.log(result)
}

module.exports = new nativeCSS();
