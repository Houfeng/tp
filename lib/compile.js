/**
 * tp.js - 最简洁高效的js模板引擎!
 * @version v3.6.2
 * @link http://houfeng.net/tp
 * @license MIT
 * @author Houfeng
 * @email admin@xhou.net
 */
var tp=require("../src/tp"),fs=require("fs"),path=require("path"),pkg=require("../package.json"),compileTmpl=tp.compile(fs.readFileSync(path.normalize(__dirname+"/compile.tp")).toString()),createHandler=tp._createHandler.toString(),controlledExecute=tp._controlledExecute.toString();module.exports=function(e,r){var t=tp.compile(r),n=compileTmpl({name:e||"unknown",src:t.src,createHandler:createHandler,controlledExecute:controlledExecute,engine:pkg.rawName+" "+pkg.version});return n};