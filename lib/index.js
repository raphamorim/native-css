var fs = require('fs'),
  input = process.argv[2];

exports.readFile = function(path) {
  return fs.readFileSync(path, 'utf8');
};

exports.writeFile = function(path, body) {
  return fs.writeFileSync(path, body);
};

exports.appendFile = function(path, body) {
  return fs.appendFileSync(path, body);
};

exports.verify = function(args) {
  if (typeof args === 'object') {
    if (args.indexOf(input) == -1)
      return false;

    return true;
  } else {
    if (args != input)
      return false;

    return true;
  }
};

exports.camelize = function(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};
