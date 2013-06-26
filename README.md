### 欢迎来到tp的世界
>欢迎使用tp! 最轻量，简洁，高效的javascript模板引擎！
>如同“tp”的名字，“轻量、简洁、高效”是tp的哲学！

### 简介
```
+ 轻量，tp是目前能见到最轻量的javascript模板引擎，只有一个不足1.5k的文件。
+ 简洁，tp的语法非常简单，对于一个熟悉html、js的开发人员来说学习难度为0。
+ 高效，tp支持模板预编译，快于任何一个你所见过的javascript模板引擎。
+ 另外，tp同时支持在浏览器环境使用及服务端javascript环境(Node.js)使用。
```

### 最新版本
>v 1.6

### 许可协议
>[使用tp请您遵守LGPL协议，否则您将会被起诉。（点击可查看LGPL协议）](http://www.gnu.org/licenses/lgpl.html)


### 支持
```
+ 您可以发邮件到 admin@xhou.net
+ 或者访问 http://www.houfeng.net
+ 关注微博 http://weibo.com/houfeng
```

### 使用指南

##### 如何使用？
```
+ 下载tp
+ 将tp.js或tp-min.js放到项目中合适的位置。
+ 在相关页面用<script src='tp的url'></script>引入tp。
```

#### 解析(tp.parse)
代码:
```javascript
var html='<div>My name is {# $(this.name) #}</div>';
var rs=tp.parse(html,{name:'tp'});
```
结果:
```
rs: “<div>My name is tp</div>”
```

#### 编译(tp.complite)
代码:
```javascript
var html='<div>My name is {# $(this.name) #}</div>';
var fn=tp.complite(html);
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
<ul id="list">
{# for(var i in this #}
<li>{# $(this[i]) #}</li>
{# } #}
</ul>
```
代码:
```javascript
var list=document.getElementById('list');

//方式1,直接使用:
tp.element(list).bind(["item-1","item-2"]); //绑定数据
tp.element(list).append(["item-1","item-2"]); //追加绑定数据

//方式2,先初始化后使用:
tp.element(list);//初始化元素
list.tp.bind(["item-1","item-2"]); //绑定数据
list.tp.append(["item-1","item-2"]); //追加绑定数据
```

结果:
```html
<ul id="list">
<li>item-1</li>
<li>item-2</li>
</ul>
```