var tp = require('../src/tp');
var fs = require('fs');
var path = require('path');
var pkg = require('../package.json');

var compileTmpl = tp.compile(fs.readFileSync(path.normalize(__dirname + '/compile.tp')).toString());
var createHandler = tp._createHandler.toString();
var controlledExecute = tp._controlledExecute.toString();

module.exports = function(name, srcBuffer) {
    var func = tp.compile(srcBuffer);
    var dstBuffer = compileTmpl({
        "name": name || 'unknown',
        "src": func.src,
        "createHandler": createHandler,
        "controlledExecute": controlledExecute,
        "engine": pkg.rawName + ' ' + pkg.version
    });
    return dstBuffer;
};