今天我们来研究一道字节跳动的前端面试题，即`JavaScript如何实现并发控制`。

## 题目要求

题目是这样的：要求用`JS`实现一个带并发限制的异步调度器`Scheduler`，保证同时运行的任务最多有两个。

它给出的初始代码如下，要求我们实现`addTask`方法，使之输出结果满足要求。
```js
class Scheduler {
  // ...todo
}
const scheduler = new Scheduler(2);
const addTask = (time, name) => {
  scheduler.add(time, name);
};

addTask(1000,"1"); // 1000ms 后输出1
addTask(500,"2");  // 500ms 后输出2
addTask(600,"3"); // 1100ms 后输出3
addTask(400,"4"); // 1400ms 后输出4
scheduler.start();
```
我们先来分析一下这段代码可以得到如下信息：
1. `scheduler` 是一个构造器，它提供一个构造器入参，限制任务同时并发的数量，它有一个 `start` 方法，调用 `start()` 后，任务会开始执行。它还有一个 `add` 方法，往`scheduler`中添加任务。
2. `addTask(time, name)` 函数有两个参数 `time` 和 `name` ，分别表示`任务执行的时间`和`任务名字`。

我们再来依次分析下`输出结果`：
1. `1000ms 后输出1`：这个很好理解，因为第一个任务的执行时间就是 1000ms；
2. `500ms 后输出2`：这个也好理解，因为第二个任务的执行时间就是 500ms；
3. `1100ms 后输出3`：这里第三个任务是在`1100ms`后输出的，是因为`任务同时执行的并发数量为 2 个`，所以必须这第三个任务必须等待前两个任务其中一个完成后，才能开始执行，这里是等待了第二个任务执行了`500ms`，再加上自己本身的执行时间`600ms`，所以`1100ms`后才输出3。
4. `1400ms 后输出4`：第三个任务开始执行后，这时候会等待任务一和任务三哪个先完成，很现任这时候任务一只剩`500ms`就执行完了，而任务三却需要`600ms`执行完，所以任务四会在任务一执行完成后才开始执行，所以任务四需要`任务一的1000ms + 本身的400ms`总共`1400ms`后输出4。


**这个并发控制就像是你去银行办业务，银行只有2个柜台，所以最多只能有两个人同时办业务，第三个人需要等待前两个人的其中一个办完业务后，才能开始办业务，第四个人的话依次类推**。


明白了题目的要求之后，我们这里开始实现：

## 解题思路一：等任务完成后递归执行下一个任务，并且用变量 runningCount 控制并发数

先来实现下 `Scheduler` 的 `constructor`：
```js
class Scheduler {
    constructor(limit) {
        this.tasks = [] // 任务队列
        this.limit = limit // 最大并发数
        this.runningCount = 0 // 当前正在运行的任务个数
    }
}
```
再来实现下添加任务的 `add` 方法：
```js
class Scheduler {
    // ...
    add(delay, name) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(name)
                    resolve()
                }, delay)
            })
        }
        this.tasks.push(promiseCreator)
    }
    // ...
}
```
我这里声明了一个`promiseCreator`函数，它用来在执行的时间后执行任务，并且返回一个`promise`。

我们还需要一个执行任务的`run`方法：
```js
class Scheduler {
    // ...
   run() {
        // tasks空校验 + 限制并发数
        if (!this.tasks.length || this.runningCount >= this.limit) {
            return
        }
        // 当前正在执行的任务数+1
        this.runningCount++
        // 从 tasks 头部取出一个任务并执行
        this.tasks.shift()().finally(() => {
            // 当前任务已经执行完了，所以 runningCount 需要-1
            this.runningCount--
            // 执行下一个任务
            this.run()
        })
    }
    // ...
}
```

最后我们需要实现`start`方法，先取`limit`个任务并调用`run`方法开始执行。
```js
class Scheduler {
    // ...
  start() {
      for(let i = 0; i < this.limit; i++) {
          this.run()
      }
  }
  // ...
}
```

完整代码如下：
```js
class Scheduler {
    constructor(limit) {
        this.tasks = [] // 任务队列
        this.limit = limit // 最大并发数
        this.runningCount = 0 // 当前正在运行的任务个数
    }
    add(delay, name) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(name)
                    resolve()
                }, delay)
            })
        }
        this.tasks.push(promiseCreator)
    }
    run() {
        // tasks空校验 + 限制并发数
        if (!this.tasks.length || this.runningCount >= this.limit) {
            return
        }
        // 当前正在执行的任务数+1
        this.runningCount++
        // 从 tasks 头部取出一个任务并执行
        this.tasks.shift()().finally(() => {
            // 当前任务已经执行完了，所以 runningCount 需要-1
            this.runningCount--
            // 递归执行下一个任务
            this.run()
        })
    }
    start() {
        for(let i = 0; i < this.limit; i++) {
            this.run()
        }
    }
}
```

核心思路就是：比如并发数为 2 个：
1. 先在`start 方法`中，调用`run()`方法开始执行前两个任务；
2. 然后在每一个任务执行完后，继续调用 `run` 方法递归执行下一个任务。

你可能会有疑问，在我这里 `runningCount` 似乎并没起到作用，似乎去掉也能正常得到想要的结果。

但假如 `start方法` 被一次性主动调用多次，没有 `runningCount` 限制，输出结果就会异常了，有兴趣的小伙伴可以试下。

## 解题思路二：利用 Promise 链 + Promise.race
同样的先来实现下`Scheduler`的`constructor`：
```js
class Scheduler {
    constructor(limit) {
        this.tasks = []
        this.limit = limit
    }
}
```
我们先来实现下添加任务的 `add` 方法，这里只是把任务执行时间 `delay` 和任务名称 `name` 存到一个对象中：
```js
class Scheduler {
    // ...
    add(delay, name)  {
        this.tasks.push({ delay, name })
    }
    // ...
}
```

再来实现下`start`方法：
```js
class Scheduler {
    // ...
    start() {
        start() {
        // 创建一个只有 limit 个并发量的 任务池
        const pool = this.tasks.slice(0, this.limit).map(({ delay, name }, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(name)
                    // 这里把当前任务在任务池中的索引传递出去，后续会用到
                    resolve(index)
                }, delay)
            })
        })
        let p = Promise.race(pool)
        for(let i = this.limit; i < this.tasks.length; i++) {
            // 通过for循环形成一条promise链
            p = p.then((index) => {
                // 利用Promise.race拿到任务池中最快完成的任务，在then回调用通过之前存的这个任务在任务池中的索引，用新的任务将它替换
                pool[index] = new Promise((resolve) => {
                    const { delay, name } = this.tasks[i]
                    setTimeout(() => {
                        console.log(name)
                        resolve(index)
                    }, delay)
                })
                // 再利用Promise.race拿到任务池中最快完成的任务
                return Promise.race(pool)
            })
        }
        return p
    }
    }
    // ...
}
```

完整代码如下：
```js
class Scheduler {
    constructor(limit) {
        this.tasks = []
        this.limit = limit
    }
    start() {
        // 创建一个只有 limit 个并发量的 任务池
        const pool = this.tasks.slice(0, this.limit).map(({ delay, name }, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(name)
                    // 这里把当前任务在任务池中的索引传递出去，后续会用到
                    resolve(index)
                }, delay)
            })
        })
        let p = Promise.race(pool)
        for(let i = this.limit; i < this.tasks.length; i++) {
            // 通过for循环形成一条promise链
            p = p.then((index) => {
                // 利用Promise.race拿到任务池中最快完成的任务，在then回调用通过之前存的这个任务在任务池中的索引，用新的任务将它替换
                pool[index] = new Promise((resolve) => {
                    const { delay, name } = this.tasks[i]
                    setTimeout(() => {
                        console.log(name)
                        resolve(index)
                    }, delay)
                })
                // 再利用Promise.race拿到任务池中最快完成的任务
                return Promise.race(pool)
            })
        }
        return p
    }
    add(delay, name)  {
        this.tasks.push({ delay, name })
    }
}
```

其核心思路如下：
1. 先创建一个任务池 `pool`，`pool` 的长度就是并发数量。
2. 在将任务推入到 `pool` 中时，通过闭包，将每个任务在`pool`中的索引保存下来，
3. 通过`for循环`形成一条`promise链`，`promise链`的长度就是**剩下需要执行的任务的个数**，
4. 通过`Promise.race`拿到任务池中最快完成的任务，在其`then`回调用通过之前存的这个任务在任务池中的`索引`，用新的任务将它替换。


## 小结
上面介绍了一道字节的面试真题，即`如何通过JavaScript实现并发控制`，并提供了两种解决方案，第一种方案比较常规一些，相信大家很容易能想到，而第二种实现方式，就需要看到并发控制第一时间就想到使用`Promise.race`了，再配上`promise链`，就可以实现了！

第一种方案和第二种方案的区别在于，第二种方案创建了一个用于调度 `任务池`，`任务池`的容量就是同时并发数，并且在里面有任务执行完后，会及时让下一个任务填补到对应位置并开始执行，而第一种方案是通过变量去控制并发数，在任务执行完后递归调用 `run` 方法，让下一个任务开始执行。

除了这两种大家还有其它更巧妙的解题思路么？欢迎大家留言评论！

