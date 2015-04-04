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

nativeCSS.prototype.indentObject = function(obj, indent) {
    var self = this,
        result = '';

    if (!indent) indent = '';

    for (var property in obj) {
        var value = obj[property];
        if (typeof value == 'string')
            value = "'" + value + "'";
        else if (typeof value == 'object') {
            if (value instanceof Array) {
                value = "[ " + value + " ]";
            } else {
                var od = self.indentObject(value, indent + "  ");
                value = "{\n" + od + "\n" + indent + "}";
            }
        }
        result += indent + "" + property + ": " + value + ",\n";
    }

    return result.replace(/,\n$/, "");
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
        body = self.indentObject(obj, '  ');
        src.appendFile(where, body + '\n});');
        return;
    }

    body = self.indentObject({
        'styles': obj
    });
    src.writeFile(where, body);
}

module.exports = new nativeCSS();