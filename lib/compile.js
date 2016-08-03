var tp = require('../');
var fs = require('fs');
var path = require('path');
var uglifyJs = require("uglify-js");
var pkg = require('../package.json');
var os = require('os');

var compileTmpl = tp.compile(fs.readFileSync(path.normalize(__dirname + '/compile.tp')).toString());
var createHandler = tp._createHandler.toString();
var controlledExecute = tp._controlledExecute.toString();
var extend = tp.extend.toString();
var inArray = tp._inArray.toString();

module.exports = function (name, srcBuffer) {
  var func = tp.compile(srcBuffer);
  var dstBuffer = compileTmpl({
    "name": name || 'unknown',
    "src": func.src,
    "createHandler": createHandler,
    "controlledExecute": controlledExecute,
    "extend": extend,
    "inArray": inArray,
    "engine": pkg.rawName + ' ' + pkg.version,
    "EOL": os.EOL
  });
  var result = uglifyJs.minify(dstBuffer, {
    fromString: true
  });
  return '/* compiled by tp */\n' + result.code;
};