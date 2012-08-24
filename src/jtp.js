/**
 * jtp 1.0 beta 1
 * jpt模板引擎，最简洁高效的js模板引擎
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 */
this.jtp = {};
(function(owner) {
	/**
	 * 辅助对象及方法
	 * @type {Object}
	 */
	owner.helper = {
		codeExp: new RegExp('(\{\%(.|\n)*?\%\})', 'gim'),
		codeBeginExp: new RegExp('\{\%', 'gim'),
		codeEndExp: new RegExp('\%\}', 'gim'),
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
	owner.complete = function(source) {
		owner.helper.codeExp.lastIndex = 0;
		owner.helper.codeBeginExp.lastIndex = 0;
		owner.helper.codeEndExp.lastIndex = 0;
		var buffer = ['var jtp={buffer:[],print:function(x){jtp.buffer.push(x);}};var $=jtp.print;'];
		var codeBlocks = source.match(owner.helper.codeExp);
		var textBlocks = source.replace(owner.helper.codeExp, '▎').split('▎');
		for (var i = 0; i < textBlocks.length; i++) {
			buffer.push('jtp.print("' + owner.helper.replaceChar(textBlocks[i]) + '");');
			if (codeBlocks && codeBlocks[i]) buffer.push(codeBlocks[i].replace(owner.helper.codeBeginExp, '').replace(owner.helper.codeEndExp, '') + ';');
		};
		buffer.push('return jtp.buffer.join("");');
		var fn = function() {};
		owner.helper.tryInvoke(function() {
			fn = new Function(buffer.join(''));
		});
		return function(model) {
			model = model || owner;
			return owner.helper.tryInvoke(function() {
				return fn.call(model, model);
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
})(this.exports || this.jtp);
