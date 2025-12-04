今天来聊一聊`javascript`如何动态执行js代码，我总结了以下四种方法。
## 第一种方式：eval
`eval`函数会将传入的字符串作为js代码执行，并且返回最后一个表达式的值。

```js
eval('console.log(1)') // 1
```

`eval`的特点：
1. 同步执行；
2. 执行环境为**当前作用域**。

```js
let a = 1;
function test() {
  let a = 2;
  eval('console.log(a)'); // 2
}
test();
```

使用`eval`需要注意：
- 安全风险：任何时候都不要把用户的输入放入eval中执行，可能被注入恶意代码（如 eval('alert("XSS")')）。
- 性能差：eval 会中断 JavaScript 引擎的优化，导致执行速度变慢。
- 可读性和维护性差：动态生成的代码难以调试和维护。

## 第二种方式：new Function
可以通过构造函数`Function`动态创建一个函数，然后主动执行它。

`Function`的函数签名如下：
```
new Function([arg1, arg2, ...argN], functionBody)
```
其中，arg1, arg2, ...argN 是参数名，functionBody 是函数体。

```js
let a = 1;
function test() {
  let a = 2;
  let fn = new Function('console.log(a)');
  fn(); // 1
}
test();
```

`new Function`的特点：
1. 同步执行；
2. 执行环境为**全局作用域**。


## 第三种方式：setTimeout

平常我们使用`setTimeout`第一个传递的是一个函数，第二个参数是延迟执行的时间。
```js
setTimeout(functionRef, delay);
```

但其实，`setTimeout`的第一个参数也可以是一个字符串，表示要执行的代码。

```js
setTimeout('console.log(1)', 1000); // 1
```

来看看`setTimeout`执行的作用域：
```js
let a = 1;
function test() {
  let a = 2;
  setTimeout('console.log(a)', 1000); // 1
}
test();
```

所以`setTimeout`的特点如下：
1. 异步执行；
2. 执行环境为**全局作用域**。

## 第四种方式：script标签
在浏览器环境中，我们可以动态创建`script`标签来执行代码。

```js
var a = 1;
let script = document.createElement('script');
script.textContent = 'console.log(1)';
document.body.appendChild(script); // 1
```

这个都不用多说了，肯定是全局作用域，所以`script`动态执行的特点如下：
1. 同步执行；
2. 执行环境为**全局作用域**。


## 应用场景

动态执行js这个功能在业务开发几乎不用用到，但在一些打包工具中会用到，比如`webpack`。

### 1. devtool使用eval
在`webpack`的配置文件`webpack.config.js`，有一项关于`devtool`的配置。

```js
// webpack.config.js
module.exports = {
  devtool: 'eval-source-map',
}
```
当把`devtool`设置为`eval-source-map`时，`webpack`打包出来的代码会使用`eval`进行包裹。

打包前的代码：

```js
// ./src/index.js
console.log(1)
```

打包后的产物长这样，这里我使用的是`webpack5`。

```js
// bundle.js
(() => {
  var __webpack_modules__ = ({
    "./src/index.js":
      (() => {
        eval("console.log(1)//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygxKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

      })

  });
  var __webpack_exports__ = {};
  __webpack_modules__["./src/index.js"]();
})();
```

这样的好处是：
1. `source-map`映射内置在打包后的js文件中，不会生产单独的`source-map`文件；
2. 由于是用`eval`直接包裹，所以构建速度快，适合**开发环境**调试使用。

顺便提一下，开发环境一般会使用`eval-cheap-module-source-map`，相比于`eval-source-map`：
1. `cheap`: 不生成列映射，只生成行映射，生成的映射文件体积更小；
2. `module`: 生成映射文件时，会保留模块的路径信息，方便调试。

生产环境如果需要调试的话，一般会使用全量的最完整的sourcemap，也就是`devtool: 'source-map'`，这样生成的映射文件虽然体积最大，但调试体验最好。

### 2. tapable中使用 new Function

 在`webpack`的编译过程中，`tapable` 实现了在编译过程中的一种发布订阅者模式的插件 `Plugin` 机制。在`tapable`的源码中，就用到了`new Function`。

 简单举个例子：

 ```js
 // Tapable 动态生成的调用函数（伪代码）
const hook = new SyncHook(["arg1", "arg2"]);
hook.tap("plugin1", (arg1, arg2) => console.log(arg1, arg2));
hook.tap("plugin2", (arg1, arg2) => console.log(arg2, arg1));
 ```

 这里用到了`SyncHook`做了一个监听，按传统的发布订阅的实现的话，内部会用`callbacks.forEach(fn => fn(...args))）`进行调用，每次触发事件都需要动态遍历回调数组，性能较低，所以`tapable`用`new Function`做了优化。

 ```js
 // 动态生成的调用逻辑
const compiledFn = new Function("arg1", "arg2", `
  plugin1Fn(arg1, arg2);
  plugin2Fn(arg2, arg1);
`);
compiledFn("a", "b");
 ```

 这里直接用`new Function`把逻辑进行动态组装成一个函数，节省了上下文开销，实现更加高效的事件触发逻辑，尤其是在处理大量钩子（Hooks）和插件时。


## 总结
主要介绍了四种动态执行js的方法：
1. eval: 同步，当前作用域；
2. new Function: 同步，全局作用域；
3. script标签: 异步，全局作用域；
4. setTimeout: 异步，全局作用域。

还简单介绍了动态执行的应用场景，比如`webpack`的`devtool`配置使用到了`eval`，`tapable`中使用`new Function`。