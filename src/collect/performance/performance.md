浏览器原生提供一个 `performance` API，可以让我们获取当前页面性能相关信息。

我们可以在控制台中打印出来看一下：
```js
console.log(performance);
```

- `performance.navigation`: 表示当前浏览上下文的 `navigation` 类型，比如页面是加载还是刷新，有多少次重定向等。
- `performance.timing`: 页面加载的性能信息。
- `performance.memory`: 内存使用情况。
- `performance.timeOrigin`: 性能测试开始前的时间戳。