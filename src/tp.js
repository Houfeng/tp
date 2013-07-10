/**
 * tp 2.1
 * tp 模板引擎，最简洁高效的js模板引擎
 * tp 可应用于Node.js，也可以在浏览器环境下使用。
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 * 网站：http://houfeng.net , http://houfeng.net/tp
 */

(function(owner) {

	/**
	 * 辅助对象及方法
	 * @type {Object}
	 */
	var utils = {
		/**
		 * 输出转义
		 */
		outTransferred: function(text) {
			text = text.replace(new RegExp('\\{1}', 'gim'), '\\\\');
			text = text.replace(new RegExp('\r{1}', 'gim'), '');
			text = text.replace(new RegExp('\n{1}', 'gim'), '\\n');
			text = text.replace(new RegExp('\r{1}', 'gim'), '\\r');
			text = text.replace(new RegExp('\"{1}', 'gim'), '\\"');
			return text;
		},
		/**
		 * 输入转义
		 */
		inTransferred: function(text) {
			return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
		},
		/**
		 * 调用方法
		 */
		invoke: function(fn) {
			try {
				return fn();
			} catch (ex) {
				return ex.description || ex.message;
			}
		}
	};

	/**
	 * 全局选项
	 * @type {Object}
	 */
	owner.option = {
		codeBegin: '\{\#',
		codeEnd: '\#\}'
	};

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
		var buffer = ['var $=function(x){$.buffer.push(x);};$.buffer=[];'];
		var codeBlocks = source.match(codeExp);
		var textBlocks = source.replace(codeExp, '▎').split('▎');
		for (var i = 0; i < textBlocks.length; i++) {
			buffer.push('$("' + utils.outTransferred(textBlocks[i]) + '");');
			if (codeBlocks && codeBlocks[i]) {
				buffer.push(codeBlocks[i].replace(codeBeginExp, '').replace(codeEndExp, '') + ';');
			}
		};
		buffer.push('return $.buffer.join("");');
		//
		var fn = function(model) {
			model = model || {};
			return utils.invoke(function() {
				return fn.src.call(model, model) || '';
			});
		};
		utils.invoke(function() {
			fn.src = new Function(buffer.join(''));
		});
		return fn;
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
	 * @return {Object} 扩展的功能实体；
	 */
	if (typeof window !== 'undefined' && window.document) {
		owner.queryElement = function(id) {
			return window.document.getElementById(id);
		};
		var templates = {};
		owner.bind = function(option) {
			option = option || {};
			option.el = option.el || option.element;
			option.el = (typeof option.el === 'string') ? owner.queryElement(option.el) : option.el;
			option.tp = option.tp || option.template || option.el;
			option.tp = (typeof option.tp === 'string') ? (owner.queryElement(option.tp) || option.tp) : option.tp;
			if (!option.tp || !option.el) return;
			templates[option.tp] = templates[option.tp] || owner.compile(utils.inTransferred(option.tp.innerHTML || option.tp), option);
			if (option.append) {
				option.el.innerHTML += templates[option.tp](option.model);
			} else {
				option.el.innerHTML = templates[option.tp](option.model);
			}
		};
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
	//创建全局jtp对象
	if (typeof window !== 'undefined') {
		window.jtp = window.tp = owner;
	}
	return owner;
})());