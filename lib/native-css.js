'use strict';

var packageJson = require('../package.json'),
    src = require('../src');

var nativeCSS = function() {};

nativeCSS.prototype.version = function() {
    return ('native-css version: ' + packageJson.version)
}

nativeCSS.prototype.help = function() {
    return src.readFile('docs/help.md')
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

nativeCSS.prototype.cleanIrregularities = function(css) {
    var ids = css.match(/(#[a-z][a-z\-_]*)/ig) || [];

    ids.forEach(function(idElement) { 
        var classElement = idElement.replace('#', '.');
        css = css.replace(idElement, classElement);
    }); 

    return css;
}

nativeCSS.prototype.convert = function(cssFile) {
    var path = process.cwd() + '/' + cssFile;

    if (!(require('fs').existsSync(path))) 
        return 'Ooops!\nError: CSS file not found!';

    var self = this,
        css = src.readFile(path);
        css = css.replace(/\s/g, '');

    css = self.cleanIrregularities(css);
    
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

    return result;
}

module.exports = new nativeCSS();
