/**
 * tp 3.0
 * tp 模板引擎，最简洁高效的js模板引擎
 * tp 可应用于Node.js，也可以在浏览器环境下使用。
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 * 网站：http://houfeng.net , http://houfeng.net/tp
 */

(function(owner) {

	/**
	 * 全局选项
	 */
	owner.option = {
		codeBegin: '\<\%',
		codeEnd: '\%\>'
	};

	function outTransferred(text) {
		text = text.replace(new RegExp('\\{1}', 'gim'), '\\\\');
		text = text.replace(new RegExp('\r{1}', 'gim'), '');
		text = text.replace(new RegExp('\n{1}', 'gim'), '\\n');
		text = text.replace(new RegExp('\r{1}', 'gim'), '\\r');
		text = text.replace(new RegExp('\"{1}', 'gim'), '\\"');
		return text;
	};

	function inTransferred(text) {
		return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
	};

	function tryInvoke(fn, message) {
		try {
			return fn();
		} catch (ex) {
			ex.message = ex.message || "";
			ex.stack = ex.stack || "";
			ex.message = message + " : " + ex.message + "\r\n    " + ex.stack;
			throw ex;
		}
	};

	var extendTable = {};

	function extend(src, dst) {
		dst = dst || extendTable;
		for (var name in src) {
			dst[name] = src[name];
		};
	};

	function createHandler() {
		var handler = function(text) {
			handler.buffer.push(text);
		};
		extend(extendTable, handler);
		return handler;
	};

	owner.extend = extend;

	/**
	 * 编译一个模板
	 * @param  {String} source 模板源字符串
	 * @return {Function}      编译后的模板函数
	 */
	owner.compile = function(source, option) {
		source = source || '';
		option = option || {};
		option.codeBegin = option.codeBegin || owner.option.codeBegin;
		option.codeEnd = option.codeEnd || owner.option.codeEnd;
		//
		var codeBeginExp = new RegExp(option.codeBegin, 'gim');
		var codeEndExp = new RegExp(option.codeEnd, 'gim');
		//提出代码块（包括开始、结束标记）
		var codeExp = new RegExp('(' + option.codeBegin + '(.|\n|\r)*?' + option.codeEnd + ')', 'gim');
		//
		var buffer = ['with($.model){'];
		var codeBlocks = source.match(codeExp);
		var textBlocks = source.replace(codeExp, '▎').split('▎');
		for (var i = 0; i < textBlocks.length; i++) {
			buffer.push('$("' + outTransferred(textBlocks[i]) + '");');
			if (codeBlocks && codeBlocks[i]) {
				buffer.push(codeBlocks[i].replace(codeBeginExp, '').replace(codeEndExp, '') + ';');
			}
		};
		buffer.push('};return $.buffer.join("");');
		//
		var func = function(model) {
			var handler = createHandler();
			handler.func = func;
			handler.buffer = [];
			handler.model = model || {};
			return tryInvoke(function() {
				return (handler.func.src.call(handler.model, handler) || '');
			}, "Template execute error");
		};
		tryInvoke(function() {
			func.src = new Function("$", buffer.join(''));
		}, "Template compile error");
		return func;
	};

	/**
	 * 解析模板
	 * @param  {String} source  模板源字符串
	 * @param  {Objtect} model  数据模型
	 * @return {String}         解析结果
	 */
	owner.parse = function(source, model, option) {
		var fn = owner.compile(source, option);
		return fn(model);
	};

	/**
	 * 如果在浏览器环境，添加针对DOM的扩展方法；
	 */
	if (typeof window !== 'undefined' && window.document) {
		owner.query = (owner.option.query || function(id) {
			return window.document.getElementById(id);
		});
		var templates = {};
		owner.bind = function(option) {
			option = option || {};
			option.el = option.el || option.element;
			option.el = (typeof option.el === 'string') ? owner.query(option.el) : option.el;
			option.tp = option.tp || option.template || option.el;
			option.tp = (typeof option.tp === 'string') ? (owner.query(option.tp) || option.tp) : option.tp;
			if (!option.tp || !option.el) return;
			templates[option.tp] = templates[option.tp] || owner.compile(inTransferred(option.tp.innerHTML || option.tp), option);
			if (option.append) {
				option.el.innerHTML += templates[option.tp](option.model);
			} else {
				option.el.innerHTML = templates[option.tp](option.model);
			}
		};
		window.tp = owner;
	}

})((function() {
	//支持CommonJS规范
	var owner = (typeof exports === 'undefined') ? {} : exports;
	//支持AMD规范
	if (typeof define === 'function' && define.amd) {
		define('tp', [], function() {
			return owner;
		});
	}
	return owner;
})());
//end.