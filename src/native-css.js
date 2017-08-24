const packageJson = require('../package.json');
const lib = require('../lib');
const cssParser = require('css');
const fetchUrl = require('fetch').fetchUrl;
const Promise = require('bluebird');

class NativeCSS {
  version() {
    return `native-css version: ${packageJson.version}`;
  }

  help() {
    return lib.readFile(__dirname + '/../docs/help.md');
  }

  indentObject(obj, indent) {
    return JSON.stringify(obj, null, indent || 0);
  }

  nameGenerator(name) {
    name = name.replace(/\s\s+/g, ' ');
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/g, '');
    name = name.replace(/_+$/g, '');
    return name;
  }

  mediaNameGenerator(name) {
    return `@media ${name}`;
  }

  transform(css) {
    const result = {};

    this.transformRules(css.stylesheet.rules, result);

    return result;
  }

  transformRules(rules, result) {
    rules.forEach(rule => {
      const obj = {};

      if (rule.type === 'media') {
        const name = this.mediaNameGenerator(rule.media);
        const media = result[name] = result[name] || {
          '__expression__': rule.media
        };

        this.transformRules(rule.rules, media);
      } else if (rule.type === 'rule') {
        rule.declarations.forEach(declaration => {
          if (declaration.type === 'declaration') {
            obj[declaration.property] = declaration.value;
          }
        });
        rule.selectors.forEach(selector => {
          const name = this.nameGenerator(selector.trim());

          result[name] = obj;
        });
      }
    });
  }

  isUrl(str) {
    // feel free to use a better pattern
    const pattern = new RegExp('^(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'); //eslint-disable-line

    if (!pattern.test(str)) {
      return false;
    }
    return true;
  }

  fetchUrlAsync(cssFile) {
    return new Promise((resolve, reject) => {
      fetchUrl(cssFile, (err, meta, body) => {
        if (err) throw err;
        try {
          resolve(body.toString());
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  convertAsync(cssFile) {
    const path = `${process.cwd()}/${cssFile}`;

    return new Promise((resolve, reject) => {
      if (!this.isUrl(cssFile)) {
        if ((require('fs').existsSync(path))) {
          let css = lib.readFile(path);

          css = cssParser.parse(css, {
            silent: false,
            source: path
          });
          return resolve(this.transform.apply(css));
        }
        reject(new Error('Ooops!\nError: CSS file not found!'));
      } else {
        return this.fetchUrlAsync(cssFile)
          .catch((err) => {
            reject(err);
          })
          .then((css) => {
            css = cssParser.parse(css, {
              silent: false,
              source: path
            });

            resolve(this.transform(css));
          });
      }
    });
  }

  convert(cssFile) {
    const path = `${process.cwd()}/${cssFile}`;
    let css;

    // PATH given
    if ((require('fs').existsSync(path))) {
      css = lib.readFile(path);
    } else if (typeof cssFile === 'string') { // STRING given
      css = cssFile;
    } else if (cssFile instanceof Buffer) { // Buffer given
      css = cssFile.toString();
    } else if (this.isUrl(cssFile)) { // URL given
      return this.convertAsync(cssFile);
    } else { // unknown format
      return 'Ooops!\nError: CSS file not found!';
    }
    css = cssParser.parse(css, { silent: false, source: path });
    return this.transform(css);
  }

  generateFile(obj, where, react) {
    if (!where || where.indexOf('--') > -1) {
      return console.log('Please, set a output path!');
    }

    let body;

    where = `${process.cwd()}/${where}`;

    if (react) {
      lib.writeFile(where, 'var styles = StyleSheet.create({\n');
      body = this.indentObject(obj, 2);
      lib.appendFile(where, `${body}\n});`);
      return;
    }

    body = this.indentObject({
      styles: obj
    }, 2);
    lib.writeFile(where, body);
  }
}

module.exports = new NativeCSS();
