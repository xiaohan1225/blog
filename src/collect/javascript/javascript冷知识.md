## 浏览器地址栏可以执行javascript代码

在地址栏中输入`javascript:alert('hello world')`，然后按回车键，会弹出一个提示框显示`hello world`。

> 注意：如果直接把这段代码复制到地址栏，浏览器会删除掉前面`javascript:`（比如谷歌浏览器、edge浏览器），需要自己手动加上。

## 浏览器地址栏可以运行html

在地址栏中输入`data:text/html,<div>hello world</div>`，然后按回车键，会显示一个包含`hello world`的div元素。

利用这个能力，我们可以把浏览器标签页变成一个编辑器。

`contenteditable`属性能把一个元素变成可编辑的，所以我们如果在地址栏中输入`data:text/html,<html contenteditable>`，就可以把页面直接变成一个编辑器了。

## 把整个网页变成可编辑

只需要在浏览器控制台中输入这样一行代码，就能把整个页面变成可编辑的。
```js
document.body.contentEditable = 'true';
```

## 利用a标签解析URL

```js
const a = document.createElement('a');
a.href = 'https://www.baidu.com/s?a=1&b=1#hash';
console.log(a.host); // www.baidu.com
console.log(a.pathname); // /s
console.log(a.search); //  ?a=1&b=1
console.log(a.hash); // #hash
```

## HTML的ID和全局变量的映射关系

在HTML中，如果有一个元素的id是`a`，那么在全局作用域中，会有一个变量`a`，这个变量指向这个元素。

```html
<div id="a"></div>
<script>
  console.log(a); // <div id="a"></div>
</script>
```

如果id重复了，还是会生成一个全局变量，但是这个变量指向的是一个`HTMLCollection`类数组。

```html
<div id="a">a</div>
<div id="a">b</div>
<script>
  console.log(a); // HTMLCollection(2) [div#a, div#a]
</script>
```

## cdn加载省略协议头
```html
<script src="//cdn.xxx.com/xxx.js"></script>
```
src的值以//开头，省略了协议，则在加载js时，使用当前页面在协议。

如果当前页面是`https`则以`https`进行加载
如果当前页面是`http`则以`http`进行加载
如果当前页面是`ftp`则以`ftp`进行加载

## 小恶作剧：隐藏鼠标光标
```html
<style>
  * {
    cursor: none !important;
  }
</style>
```

## 文字模糊效果
```html
<style>
  .text {
    color: transparent;
    text-shadow: #111 0 0 5px;
    user-select: none;
  }
</style>

<span>hello</span><span class="text">world</span>
```

## 不借助js和css，让元素消失
```html
<div hidden>hello world</div>
```

## 用js获取网络带宽
```js
const downlink = navigator.connection.downlink;
console.log('带宽为', downlink + ' Mbps');
```

## 保护隐私
禁用`F12`快捷键：
```js
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 123) {
    e.preventDefault();
  }
})
```

禁用右键菜单：
```js
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
})
```

## css实现三角形
```html
<style>
  .triangle {
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-top-color: red;
  }
</style>

<div class="triangle"></div>
```

## 为啥 a === a-1 结果为true
当`a`为`Infinity`无穷大时，`a - 1`的结果也是`Infinity`，所以`a === a - 1`的结果为`true`。

同理，`a`的值为`-Infinity`时，此等式也成立。
```js
const a = Infinity;
console.log(a === a - 1);
```

## Emmet神器
Emmet官方文档：[https://docs.emmet.io/cheat-sheet/https://docs.emmet.io/cheat-sheet/](https://docs.emmet.io/cheat-sheet/)

## 数字的包装类
```js
console.log(1.toString()); // 报错
console.log(1..toString()); // 正常运行 输出字符串'1'
```

## 防止网站以 iframe 方式被加载
```js
if (window.location !== window.parent.location) window.parent.location = window.location;
```

## datalist的使用
```html
<input list="fruits" name="fruit" />
<datalist id="fruits">
  <option value="苹果"></option>
  <option value="橘子"></option>
  <option value="香蕉"></option>
</datalist>
```

## 文字纵向排列
```html
<style>
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
</style>

<div class="vertical-text">文字纵向排列</div>
```

## 禁止选中文字
```js
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
})
```
</style>
```

## 利用逗号，在一行中执行多个表达式
```js
let a = 1;
let b = 2;
(a += 2), (b += 3);
```

## inset
`inset`是一个简写属性，用于同时设置元素的 top、right、bottom 和 left 属性

```css
.box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
```
可以简写成：
```css
.box {
    position: absolute;
    inset: 0;
}
```