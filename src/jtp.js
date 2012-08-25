/**
 * jtp 1.0 beta 1
 * jtp 模板引擎，最简洁高效的js模板引擎
 * jtp 可应用于Node.js，也可以在浏览器环境下使用。
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 */
var jtp = {};
(function(owner) {
	owner.codeBegin = '\<\@';
	owner.codeEnd = '\@\>';
	/**
	 * 辅助对象及方法
	 * @type {Object}
	 */
	owner.helper = {
		codeExp: new RegExp('(' + owner.codeBegin + '(.|\n)*?' + owner.codeEnd + ')', 'gim'),
		codeBeginExp: new RegExp(owner.codeBegin, 'gim'),
		codeEndExp: new RegExp(owner.codeEnd, 'gim'),
		replaceChar: function(text) {
			text = text.replace(new RegExp('\\{1}', 'gim'), '\\\\');
			text = text.replace(new RegExp('(\n{1})', 'gim'), '\\n');
			text = text.replace(new RegExp('\"{1}', 'gim'), '\\"');
			return text;
		},
		tryInvoke: function(fn) {
			try {
				return fn();
			} catch (ex) {}
		}
	};
	/**
	 * 编译一个模板
	 * @param  {String} source 模板源字符串
	 * @return {Function}      编译后的模板函数
	 */
	owner.compile = function(source) {
		owner.helper.codeExp.lastIndex = 0;
		owner.helper.codeBeginExp.lastIndex = 0;
		owner.helper.codeEndExp.lastIndex = 0;
		var buffer = ['var jtp={buffer:[],print:function(x){jtp.buffer.push(x);}};var $=jtp.print;'];
		var codeBlocks = source.match(owner.helper.codeExp);
		var textBlocks = source.replace(owner.helper.codeExp, '▎').split('▎');
		for (var _index = 0; _index < textBlocks.length; _index++) {
			buffer.push('jtp.print("' + owner.helper.replaceChar(textBlocks[_index]) + '");');
			if (codeBlocks && codeBlocks[_index]) {
				buffer.push(codeBlocks[_index].replace(owner.helper.codeBeginExp, '').replace(owner.helper.codeEndExp, '') + ';');
			}
		};
		buffer.push('return jtp.buffer.join("");');
		var _fn = function() {};
		owner.helper.tryInvoke(function() {
			_fn = new Function(buffer.join(''));
		});
		return function(model) {
			model = model || owner || {};
			return owner.helper.tryInvoke(function() {
				return _fn.call(model, model);
			});
		};
	};
	/**
	 * 解析模板
	 * @param  {String} source  模板源字符串
	 * @param  {Objtect} model  数据模型
	 * @return {String}         解析结果
	 */
	owner.parse = function(source, model) {
		var fn = owner.complete(source);
		return fn(model);
	};
})(typeof exports === 'undefined' ? jtp : exports);
