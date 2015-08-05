/**
 * tp.js - 最简洁高效的js模板引擎!
 * @version v3.6.2
 * @link http://houfeng.net/tp
 * @license MIT
 * @author Houfeng
 * @email admin@xhou.net
 */
!function(){var e=require("path"),r=require("fs"),i=require("real-utils"),s=require("cmdline"),l=require("../package.json"),o=require("../lib/compile"),a=new s,n=process.cwd(),u=a.args[0],t=a.args[1];if(a.options.has("-v"))return console.log(l.rawName+" "+l.version);if(i.isNull(u)||i.isNull(t))return console.log("usage: tp <src> <dst>");u=e.resolve(n,u),t=e.resolve(n,t);var c=e.basename(t).split(".")[0],g=r.readFileSync(u).toString(),p=o(c,g);r.writeFileSync(t,p)}();