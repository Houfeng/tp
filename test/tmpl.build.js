/**
 * tp.js - 最简洁高效的js模板引擎!
 * @version v3.6.2
 * @link http://houfeng.net/tp
 * @license MIT
 * @author Houfeng
 * @email admin@xhou.net
 */
(function() {
    var createHandler = function createHandler(func, model, _extends) {
        var handler = function(text) {
            handler.push(text);
        };
        handler.push = function(text) {
            handler.buffer.push(text);
        };
        for (var i in _extends) {
            if (_extends[i]) extend(_extends[i], handler);
        }
        handler.func = func;
        handler.model = model || {};
        handler.buffer = [];
        return handler;
    };
    var controlledExecute = function controlledExecute(fn, message) {
        try {
            return fn();
        } catch (ex) {
            ex.message = ex.message || "";
            ex.stack = ex.stack || "";
            ex.message = message + " : " + ex.message + "\r\n    " + ex.stack;
            throw ex;
        }
    };
    var func = function(model, execOptions) {
        return func.exec(model, execOptions);
    };
    func.src = function anonymous($,$$
/**/) {
$.push("");$.push( "hello tp" );$.push("");return $.buffer.join("");
};
    func.exec = function(model, execOptions){
        execOptions = execOptions || {};
        var handler = createHandler(func, model, [execOptions.extend]);
        return controlledExecute(function() {
            handler.result = (handler.func.src.call(handler.model, handler, handler.model) || '');
            return execOptions.returnHandler ? handler : handler.result;
        }, "Template execute error");
    };
    func.engine = "tp 3.6.2";
    //commonjs
    if (typeof exports !== 'undefined') {
        module.exports = func;
    }
    //amd
    if (typeof define !== 'undefined' && define.amd) {
        define('tmpl', [], function() {
            return func;
        });
    }
    //browser
    if (typeof window !== 'undefined') {
        window['tmpl'] = func;
    }
})();