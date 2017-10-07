const fs = require('fs');
const input = process.argv[2];

exports.readFile = (path) => {
    return fs.readFileSync(path, 'utf8');
}

exports.writeFile = (path, body) => {
    return fs.writeFileSync(path, body);
}

exports.appendFile = (path, body) => {
    return fs.appendFileSync(path, body);
}

exports.verify = (args) => {
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
