#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var utils = require('ntils');
var cmdLine = require('cmdline');
var pkg = require('../package.json');
var compile = require('../lib/compile');
var cwd = process.cwd();

var helpInfo = 'usage: tp <src> <dst>';

cmdLine
  .version(pkg.rawName + ' ' + pkg.version)
  .help(helpInfo)
  .action(function ($1, $2) {
    var src = path.resolve(cwd, $1);
    var dst = path.resolve(cwd, $2);
    var funcName = path.basename(dst).split('.')[0];
    var srcBuffer = fs.readFileSync(src).toString();
    var dstBuffer = compile(funcName, srcBuffer);
    fs.writeFileSync(dst, dstBuffer);
    return false;
  })
  .ready();