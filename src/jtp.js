/**
 * jtp 1.3
 * jtp 模板引擎，最简洁高效的js模板引擎
 * jtp 可应用于Node.js，也可以在浏览器环境下使用。
 * 作者：侯锋
 * 邮箱：admin@xhou.net
 * 网站：http://houfeng.net , http://houfeng.net/jtp
 */

this.jtp = {};
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
			} catch(ex) {
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
		var codeExp = new RegExp('(' + option.codeBegin + '(.|\n)*?' + option.codeEnd + ')', 'gim');
		//
		var buffer = ['var $=function(x){$.buffer.push(x);};$.buffer=[];'];
		var codeBlocks = source.match(codeExp);
		var textBlocks = source.replace(codeExp, '▎').split('▎');
		for(var i = 0; i < textBlocks.length; i++) {
			buffer.push('$("' + utils.outTransferred(textBlocks[i]) + '");');
			if(codeBlocks && codeBlocks[i]) {
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
	 * 在浏览器环境，扩展原生元素；
	 * @return {Object} 扩展的功能实体；
	 */
	owner.element = (window == null ? null : function(element, option) {
		if(!element) return;
		if(!element.jtp) {
			element.jtp = {
				exec: owner.compile(utils.inTransferred(element.innerHTML), option),
				bind: function(model) {
					element.innerHTML = element.jtp.exec(model);
				},
				append: function(model) {
					element.innerHTML += element.jtp.exec(model);
				}
			};
			element.innerHTML = "";
		}
		return element.jtp;
	});

})(typeof exports === 'undefined' ? jtp : exports);