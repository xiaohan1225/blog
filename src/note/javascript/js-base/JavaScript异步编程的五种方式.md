
## 1、什么是异步？

异步可以理解为把一个任务分成了两段，先执行第一段，转而去执行其它任务，等准备完毕后，再回过头来执行第二段。

比如发一个 `http` 请求，第一段就是创建 `XMLHttpRequest` 对象，做好请求配置后向后端发送请求，然后就去执行其他任务(其它 js 代码)了，第二段就是拿到后端响应后，执行对应的回调函数。

这种不连续的执行，叫做异步，反之，连续的执行，叫做同步。

## 2、高阶函数

在 js 中，函数是**一等公民**。所谓一等公民，就是指函数能和数据类型一样，可以赋值给变量，也可以作为函数的参数和返回值。而传入的参数中或者返回值中带有函数的，就被称为**高阶函数**。

## 3、高阶函数的作用

### 3.1 可以批量生成函数

```js
function isType(type) {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
}

const isFunc = isType("Function");
const isBoo = isType("Boolean");
```
通过高阶函数`isType`，可以生成不同类型的判断函数，判断各种对象类型。

### 3.2 可以用于多次调用才执行的函数

```js
function after(time, callback) {
  let count = 0;
  return function() {
    if (++count === time) {
      callback.apply(this, arguments);
    }
  };
}
const f = after(3, function() {
  console.log("callback");
});
f();
```
`after`函数的作用是，在调用`f`函数三次之后，才会执行回调函数`callback`。

## 4、异步编程的五种实现方式

1. 回调函数
2. 事件监听，发布订阅
3. Promise
4. generator/yield
5. async/await

### 4.1 回调函数

回调函数是指将异步的第二段放在回调函数里面，等准备完毕后，执行回调。

```js
const fs = require("fs");
fs.readFile("./1.txt", "utf8", function(err, data) {
  console.log(err, data);
});
```

回调函数的问题：

1. 异常处理麻烦

异步代码不能用 `try catch` 捕获异常，所以如果出错了要向回调函数传入异常供调用者判断。比如在 `nodejs` 中，对异常处理有一个约定，会将异常作为回调的第一个参数返回，如果为 `null` 则表示没有出错。

2. 容易形成回调地狱

异步多级依赖的情况下代码会嵌套的很深，不利于阅读和维护。

```js
const fs = require("fs");
fs.readFile("./1.txt", "utf8", function(err1, result1) {
  fs.readFile(result1, "utf8", function(err2, result2) {
    fs.readFile(result2, "utf8", function(err3, result3) {
      console.log(result3);
    });
  });
});
```

### 4.2 事件发布/订阅模型

发布/订阅是一种设计模式，它依赖于一个事件调度中心，先注册事件名和回调(on)，然后可以主动触发(emit)。

```js
const EventEmitter = require("events");
// eve为事件调度中心
const eve = new EventEmitter();
eve.on("first", function() {
  console.log("first");
});
eve.emit("first");
```

### 4.3 Promise

Promise 本意是承诺，在程序中的意思就是承诺我过一段时间后给你一个结果，而过一段时间指的就是异步操作，比如网络请求、定时器，读取文件等。

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
p.then((result) => {
  // 1秒后打印success
  console.log(result);
});
```
### 4.4 Generator/yield
`Generator`函数是ES6提供的一种异步编程解决方案。

语法上：可以将它理解为一个状态机，其内部封装了多种状态。执行Generator函数会返回一个**遍历器对象**，可以依次迭代Generator函数内部的每一个状态，也被称为**迭代器**。

1. Generator的使用
```js
function *test() {
    const first = yield 1
    console.log(first)
    const second = yield 2
    console.log(second)
}
const it = test()
console.log(it.next())
console.log(it.next('first'))
console.log(it.next('second'))
// { value: 1, done: false }
// first
// { value: 2, done: false }
// second
// { value: undefined, done: true }
```
> 注意：第一次调用next传递参数没有意义，done的值为false表示函数调用结束了

形式上，`Generator`函数相对于普通函数而言，多了两个特性。一是`function` 关键字和函数名之间有一个星号，函数内部使用**yield**表达式，定义不同的内部状态。yield的意思是产出，可以将状态传递出去。

2. CO

`co` 是一个为nodejs和浏览器打造的基于生成器的流程控制工具，借助Promise，可以使用更加优雅的方式编写非阻塞代码。
```js
const fs = require('fs')
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}
/** 文件1.txt里面的内容是2.txt 
 *  文件2.txt里面的内容是222
*/
function *read() {
    const filename = yield readFile('1.txt')
    const result = yield readFile(filename)
    return result
}
co(read).then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})
// 最终打印222
```

`co` 实现原理如下：

```js
// co实现原理
function co(gen) {
    const it = gen()
    return new Promise((resolve, reject) => {
        !(function next(nextValue) {
            const { value, done } = it.next(nextValue)
            if (!done) {
                value.then(next, reject)
                
            } else {
                resolve(value)
            }
        })()
    })
}
```
### 4.5 async/await

`async/await` 是 `ES7` 的语法，是**js异步编程的终极解决方案**。可以理解为是Promise+Generator的语法糖，可以轻松做到Generator和co所做到的工作。
```js
const fs = require('fs')
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}
async function read() {
    const filename = await readFile('1.txt')
    const result = await readFile(filename)
    return result
}
read().then(result => {
    console.log(result)
})
```
优点：
1. 内置执行器，内部会帮你进行迭代。
2. 更好的语义，代码结构清晰
3. 更广的适用性，await后面不一定要跟promise

缺点：
1. 滥用await会导致性能问题，因为await会阻塞代码，也许后者不一定依赖前者，但仍需要等待前者完成，导致代码失去了并发性。
2. 错误处理麻烦，项目中可以用axios拦截器处理错误或者用try catch来捕获错误。
3. 经过babel编译后的代码臃肿。



