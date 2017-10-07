const packageJson = require('../package.json');
const lib = require('../lib');
const cssParser = require('css');
const fetchUrl = require('fetch').fetchUrl;
const Promise = require('bluebird');

const nativeCSS = function () {};

nativeCSS.prototype.version = function () {
    return ('native-css version: ' + packageJson.version)
}

nativeCSS.prototype.help = function () {
    return lib.readFile(__dirname + '/../docs/help.md')
}

nativeCSS.prototype.indentObject = function (obj, indent) {
    const self = this,
        result = '';
    return JSON.stringify(obj, null, indent || 0);
}

nativeCSS.prototype.nameGenerator = function (name) {
    name = name.replace(/\s\s+/g, ' ');
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/g, '');
    name = name.replace(/_+$/g, '');
    return name;
}

nativeCSS.prototype.mediaNameGenerator = function (name) {
    return '@media ' + name;
}

function transformRules(self, rules, result) {
    rules.forEach(function (rule) {
        const obj = {};
        if (rule.type === 'media') {
            const name = self.mediaNameGenerator(rule.media);
            const media = result[name] = result[name] || {
                "__expression__": rule.media
            };
            transformRules(self, rule.rules, media)
        } else if (rule.type === 'rule') {
            rule.declarations.forEach(function (declaration) {
                if (declaration.type === 'declaration') {
                    obj[declaration.property] = declaration.value;
                }
            });
            rule.selectors.forEach(function (selector) {
                const name = self.nameGenerator(selector.trim());
                result[name] = obj;
            });
        }
    });
}

nativeCSS.prototype.transform = function (css) {
    const result = {};
    transformRules(this, css.stylesheet.rules, result);
    return result;
}

nativeCSS.prototype.isUrl = function (str) {
    // feel free to use a better pattern
    const pattern = new RegExp('^(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    if (!pattern.test(str)) {
        return false;
    }
    return true;
}

nativeCSS.prototype.fetchUrlAsync = function (cssFile) {
    return new Promise(function (resolve, reject) {
        fetchUrl(cssFile, function (err, meta, body) {
            if (err) throw err;
            try {
                resolve(body.toString());
            } catch (err) {
                reject(err);
            }
        });
    });
}

nativeCSS.prototype.convertAsync = function (cssFile) {
    const self = this,
        path = process.cwd() + '/' + cssFile,
        error;

    return new Promise(function (resolve, reject) {
        if (!self.isUrl(cssFile)) {
            if ((require('fs').existsSync(path))) {
                const css = lib.readFile(path);
                css = cssParser.parse(css, {
                    silent: false,
                    source: path
                });
                return resolve(self.transform.apply(self, css));
            } else {
                reject(new Error('Ooops!\nError: CSS file not found!'));
            }
        } else {
            return self.fetchUrlAsync(cssFile)
                .catch(function (err) {
                    reject(err);
                })
                .then(function (css) {
                    const css = cssParser.parse(css, {
                        silent: false,
                        source: path
                    });
                    resolve(self.transform(css));
                });
        }
    });
};

nativeCSS.prototype.convert = function(cssFile) {
    const self = this,
        path = process.cwd() + '/' + cssFile,
        css;
    // PATH given
    if ((require('fs').existsSync(path))) {
        css = lib.readFile(path);
    }
    // STRING given
    else if (typeof cssFile === 'string') {
        css = cssFile;
    }
    // Buffer given
    else if(cssFile instanceof Buffer) {
        css = cssFile.toString();
    }
    // URL given
    else if (this.isUrl(cssFile)) {
        return this.convertAsync(cssFile);
    }
    // unknown format
    else {
        return 'Ooops!\nError: CSS file not found!';
    }
    css = cssParser.parse(css, {silent: false, source: path});
    return self.transform(css);
}

nativeCSS.prototype.generateFile = function (obj, where, react) {
    if (!where || where.indexOf('--') > -1)
        return console.log('Please, set a output path!');

    const self = this,
        body;

    where = process.cwd() + '/' + where;

    if (react) {
        lib.writeFile(where, 'var styles = StyleSheet.create({\n');
        body = self.indentObject(obj, 2);
        lib.appendFile(where, body + '\n});');
        return;
    }

    body = self.indentObject({
        'styles': obj
    }, 2);
    lib.writeFile(where, body);
}

module.exports = new nativeCSS();
