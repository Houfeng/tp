(function() {
    var path = require('path');
    var fs = require('fs');
    var utils = require('real-utils');
    var CmdLine = require('cmdline');
    var pkg = require('../package.json');
    var compile = require('../lib/compile');
    var cmdLine = new CmdLine();
    var cwd = process.cwd();

    var src = cmdLine.args[0];
    var dst = cmdLine.args[1];

    if (cmdLine.options.has('-v')) {
        return console.log(pkg.rawName + ' ' + pkg.version);
    }

    if (utils.isNull(src) || utils.isNull(dst)) {
        return console.log('usage: tp <src> <dst>');
    }

    src = path.resolve(cwd, src);
    dst = path.resolve(cwd, dst);

    var funcName = path.basename(dst).split('.')[0];
    var srcBuffer = fs.readFileSync(src).toString();
    var dstBuffer = compile(funcName, srcBuffer);
    fs.writeFileSync(dst, dstBuffer);
})();