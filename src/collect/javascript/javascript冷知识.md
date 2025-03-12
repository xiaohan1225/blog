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