const { parse } = require("yaml");
const fs = require("node:fs");

function fn(module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    
    try {
        module.exports = parse(content);
    } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};

require.extensions['.yml'] = fn;
require.extensions['.yaml'] = fn;
