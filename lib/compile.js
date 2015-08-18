/**
 * tp.js - 最简洁高效的js模板引擎!
 * @version v3.7.1
 * @link http://houfeng.net/tp
 * @license MIT
 * @author Houfeng
 * @email admin@xhou.net
 */
var tp=require("../"),fs=require("fs"),path=require("path"),uglifyJs=require("uglify-js"),pkg=require("../package.json"),compileTmpl=tp.compile(fs.readFileSync(path.normalize(__dirname+"/compile.tp")).toString()),createHandler=tp._createHandler.toString(),controlledExecute=tp._controlledExecute.toString(),extend=tp.extend.toString(),inArray=tp._inArray.toString();module.exports=function(e,r){var t=tp.compile(r),n=compileTmpl({name:e||"unknown",src:t.src,createHandler:createHandler,controlledExecute:controlledExecute,extend:extend,inArray:inArray,engine:pkg.rawName+" "+pkg.version}),i=uglifyJs.minify(n,{fromString:!0});return"/* compiled by tp */\n"+i.code};