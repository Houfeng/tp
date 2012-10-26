/**
 * jtp 1.0 beta 1
 * jtp 模板引擎，最简洁高效的js模板引擎
 * jtp 可应用于Node.js，也可以在浏览器环境下使用。
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 */
var jtp = {};
(function(owner) {
	/**
	 * 辅助对象及方法
	 * @type {Object}
	 */
	owner.helper = {
		codeBegin: '\<\@',
		codeEnd: '\@\>',
		replaceChar: function(text) {
			text = text.replace(new RegExp('\\{1}', 'gim'), '\\\\');
			text = text.replace(new RegExp('\r{1}', 'gim'), '');
			text = text.replace(new RegExp('\n{1}', 'gim'), '\\n');
			text = text.replace(new RegExp('\"{1}', 'gim'), '\\"');
			return text;
		},
		tryInvoke: function(fn) {
			try {
				return fn();
			} catch(ex) {}
		}
	};
	owner.debugMode = false;
	/**
	 * 编译一个模板
	 * @param  {String} source 模板源字符串
	 * @return {Function}      编译后的模板函数
	 */
	owner.compile = function(source, option) {
		source = source || '';
		option = option || {};
		option.codeBegin = option.codeBegin || owner.helper.codeBegin;
		option.codeEnd = option.codeEnd || owner.helper.codeEnd;
		//
		var codeBeginExp = new RegExp(option.codeBegin, 'gim');
		var codeEndExp = new RegExp(option.codeEnd, 'gim');
		var codeExp = new RegExp('(' + option.codeBegin + '(.|\n)*?' + option.codeEnd + ')', 'gim');
		//
		var buffer = ['var jtp={buffer:[],print:function(x){jtp.buffer.push(x);}};var $=jtp.print;'];
		var codeBlocks = source.match(codeExp);
		var textBlocks = source.replace(codeExp, '▎').split('▎');
		for(var i = 0; i < textBlocks.length; i++) {
			buffer.push('jtp.print("' + owner.helper.replaceChar(textBlocks[i]) + '");');
			if(codeBlocks && codeBlocks[i]) {
				buffer.push(codeBlocks[i].replace(codeBeginExp, '').replace(codeEndExp, '') + ';');
			}
		};
		buffer.push('return jtp.buffer.join("");');
		var _fn_src = function() {};
		owner.helper.tryInvoke(function() {
			_fn_src = new Function(buffer.join(''));
		});
		var _fn_debug = function(model) {
				model = model || owner || {};
				return _fn_src.call(model, model) || '';
			};
		var _fn_release = function(model) {
				model = model || owner || {};
				return owner.helper.tryInvoke(function() {
					return _fn_src.call(model, model) || '';
				});
			};
		var _fn = owner.debugMode ? _fn_debug : _fn_release;
		_fn.src = _fn_src;
		return _fn;
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
})(typeof exports === 'undefined' ? jtp : exports);