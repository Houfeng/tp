### TP 模板引擎
>Tp 是一个 “轻量，简洁，高效” 的 javascript 模板引擎！

[![npm version](https://badge.fury.io/js/tpjs.svg)](http://badge.fury.io/js/tpjs)  

### 简介
```
+ 轻量，tp是目前能见到最轻量的javascript模板引擎，只有一个不足1.5k的文件。
+ 简洁，tp的语法非常简单，对于一个熟悉html、js的开发人员来说学习难度为 0。
+ 高效，tp支持模板预编译，快于任何一个你所见过的javascript模板引擎。
+ 另外，tp同时支持在浏览器环境使用及服务端javascript环境(Node.js)使用。
```

### 联系作者
```
+ 您可以发邮件到 admin@xhou.net
+ 或者访问 http://www.houfeng.net
+ 关注微博 http://weibo.com/houfeng
```

### 在浏览器中吏用

#### 在页面中引入
```
+ 下载tp
+ 将tp.js或tp-min.js放到项目中合适的位置。
+ 在相关页面用<script src='tp的url'></script>引入tp。
```

#### AMD/CMD 方式引用
```javascript
var tp = require('相对路径');
```

#### 解析(tp.parse)
代码:
```javascript
var html='<div>My name is <% $(name) %></div>';
var rs=tp.parse(html,{name:'tp'});
```
结果:
```
rs: “<div>My name is tp</div>”
```

#### 编译(tp.compile)
代码:
```javascript
var html='<div>My name is <% $(name) %></div>';
var fn=tp.compile(html);
var rs=fn({name:'tp'});
```
结果:
```
fn: 编译结果，可以暂存以供调用。
rs: “<div>My name is tp</div>”
```

#### HTML元素
HTML:
```html
<script id="list-template" type='text/template'>
<% for(var i in this %>
<li><% $(this[i]) %></li>
<% } %>
</script>

<ul id="list">
</ul>
```
代码:
```javascript
//绑定数据:
tp.bind({
	template:'list-template',
	element:'list',
	model:["item-1","item-2"]
}); 
//追加绑定数据:
tp.bind({
	template:'list-template',
	element:'list',
	model:["item-1","item-2"],
	append:true
}); 
```

结果:
```html
<ul id="list">
<li>item-1</li>
<li>item-2</li>
</ul>
```

### 在 Node.js 中使用

#### 安装
```javascript
[sudo] npm install tpjs [-g]
```

#### 引用
```javascript
var tp = require('tpjs');

//解析
var rs = tp.parse(html,options);
//预编译
var fn = tp.compile(html,options);
```

#### 命令行工具
使用命令行工具需要全局安装 tpjs，如下
```javascript
[sudo] npm install tpjs -g
```
CLI 说明
```javascript
tp <src> <dst>
```
1. src: 源文件路径，相对于当前工作目录
2. dst: 输出的目标路径，相对于当前工作目录
