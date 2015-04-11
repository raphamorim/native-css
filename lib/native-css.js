'use strict';

var packageJson = require('../package.json'),
    src = require('../src'),
    cssParser = require('css');

var nativeCSS = function() {};

nativeCSS.prototype.version = function() {
    return ('native-css version: ' + packageJson.version)
}

nativeCSS.prototype.help = function() {
    return src.readFile(__dirname + '/../docs/help.md')
}


nativeCSS.prototype.indentObject = function(obj, indent) {
    var self = this,
        result = '';
    return JSON.stringify(obj, null, indent || 0);
}

nativeCSS.prototype.nameGenerator = function (name) {
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/, '');
    name = name.replace(/_+$/, '');
    return name;
}

nativeCSS.prototype.transform = function(css) {
    var self = this,
        result = {};
    css.stylesheet.rules.forEach(function(rule) {
        var obj = {};
        rule.declarations.forEach(function (declaration) {
            if (declaration.type === 'declaration') {
                obj[declaration.property] = declaration.value;
            }
        });
        rule.selectors.forEach(function(selector) {
            var name = self.nameGenerator(selector.trim());
            result[name] = obj;
        });
    });
    return result;
}

nativeCSS.prototype.convert = function(cssFile) {
    var path = process.cwd() + '/' + cssFile;

    if (!(require('fs').existsSync(path)))
        return 'Ooops!\nError: CSS file not found!';

    var self = this,
        css = src.readFile(path);
        css = cssParser.parse(css, {silent: false, source: path});

    return self.transform(css);
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