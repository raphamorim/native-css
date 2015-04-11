'use strict';

var packageJson = require('../package.json'),
    src = require('../src');

var nativeCSS = function() {};

nativeCSS.prototype.version = function() {
    return ('native-css version: ' + packageJson.version)
}

nativeCSS.prototype.help = function() {
    return src.readFile(__dirname + '/../docs/help.md')
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

nativeCSS.prototype.cleanInheritance = function(css) {
    var inheritance = css.match(/(?:#\w+\s+)?[\w-]+\.(?:\s+\w+\s*\w+|\s+\w+)?/ig) || [];

    inheritance.forEach(function(item) {
        var newItem = item.replace('.', '-');
        css = css.replace(item, newItem)
    })

    return css;
}

nativeCSS.prototype.indentObject = function(obj, indent) {
    var self = this,
        result = '';
    return JSON.stringify(obj, null, indent || 0);
}

nativeCSS.prototype.convert = function(cssFile) {
    var path = process.cwd() + '/' + cssFile;

    if (!(require('fs').existsSync(path)))
        return 'Ooops!\nError: CSS file not found!';

    var self = this,
        css = src.readFile(path);
        css = css.replace(/\s/g, '')
            .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );

    css = self.cleanIrregularities(css);
    css = self.cleanInheritance(css);

    var classNames = css.match(/(?:#\w+\s+)?\.[\w-]+(?:\s+\w+\s*\.\w+|\s+\w+)?/ig),
        classNamesData = '';

    var classes = [];
    var result = {};

    classNames.forEach(function(item) {
        item = item.replace('.', '');
        classNamesData = css
            .substring(css.indexOf(item), css.indexOf('}') + 1);

        css = css.replace(classNamesData, '');
        classes.push(classNamesData);

        result[item] = self.convertProperties(item, classNamesData);
    });

    return result;
}

nativeCSS.prototype.generateFile = function(obj, where, react) {
    if (!where || where.indexOf('--') > -1)
        return console.log('Please, set a output path!');

    var self = this,
        body;

    where = process.cwd() + '/' + where;

    if (react) {
        src.writeFile(where, 'var styles = StyleSheet.create({\n');
        body = self.indentObject(obj, 2);
        src.appendFile(where, body + '\n});');
        return;
    }

    body = self.indentObject({
        'styles': obj
    }, 2);
    src.writeFile(where, body);
}

module.exports = new nativeCSS();