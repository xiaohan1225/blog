
## 前言
`Promise`一直是前端面试中的热点，下面给大家介绍下`Promise的相关方法`。

## 1. Promise.all
### 1.1 介绍
调用`Promise.all`时需要传入一个`promise数组`，我们称它为`promiseArr`，然后`Promise.all`会返回一个`新的Promise`，我们把它称为`p`：
- 如果`promiseArr`中有一个`Promise`失败，则走入`p`的`catch`回调中，并拿到对应的`错误对象`。
- 如果`promiseArr`里面全成功，则会走入`p`的`then`方法中，并能拿到之前传入的`promiseArr`对应的`promise结果`。

### 1.2 原理
```js
function promiseAll(promiseArray) {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(promiseArray)) {
            return reject(new Error('传入的参数必须是数组'))
        }
        const promiseNum = promiseArray.length
        const results = new Array(promiseNum)
        let count = 0
        promiseArray.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                results[index] = res
                if(++count === promiseNum) {
                    resolve(results)
                }
            })
            .catch(reject)
        })
    })
}
```
> 注意点：
> - 需要默认返回一个promise
> - 存结果的results数组需要通过index和传入的promise数组一一对应

### 1.3 应用场景
- 并行发送多个请求。
- 多个文件的并行读取。
- 并行执行多个任务。


## 2. Promise.race
### 2.1 介绍
`race`的意思是赛跑，哪个`Promise`跑的快，也就是哪个`Promise`最先成功或失败，整个`Promise.race`也就对应的成功或失败。

### 2.2 原理
```js
function PromiseRace(promiseArray) {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(promiseArray)) {
            return reject(new Error('传入的参数必须是数组'))
        }
        promiseArray.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                resolve(res)
            })
            .catch(reject)
        })
    })
}
```
### 2.3 应用场景
- **尽快拿到请求结果**：比如多个接口都可以拿到你想请求的数据，你就可以用`Promise.race`，如果拿到了一个请求的响应结果，你就可以直接渲染页面了，这样能加快我们的页面响应速度。
- **多个资源加载**：你可以把手动去加载多个资源，然后用`Promise.race`来等待最快加载的资源后采取行动，以提高加载性能。
- **竞态条件处理**：同时尝试多个可能的解决方案，并采取第一个可用的解决方案。

## 3. Promise.prototype.finally
### 3.1 介绍
`finally`和`then`、`catch`一样，都是Promise`原型`上的方法，与`then`、`reject`一同，不管`Promise`成功还是失败，最终都会执行`finally`方法。
### 3.2 原理
```js
Promise.prototype.finally = function (cb) {
  return this.then(
    (y) => {
      return Promise.resolve(cb()).then(() => y);
    },
    (r) => {
      return Promise.resolve(cb()).then(() => {
        throw r;
      }); 
    }
  );
};
```
### 3.3 应用场景
1. **清理资源或状态**：比如你需要在最Promise执行结束之后释放一些资源，比如`打开的文件`、`数据库连接`或`网络连接`等，或者释放状态，比如`页面的loading`等
2. **执行收尾操作**：比如无论Promise成功或者失败，你都要执行一些收尾工作，比如`记录日志、发送统计信息或触发一些事件`等。
3. **统一处理**：在`then`和`catch`的时候都需要进行的处理，这时候你就不需要写两次重复的代码了，直接放在finally当中。

## 4. Promise.allSettled
### 4.1 介绍
1. Promise.allSettled()方法接收一组Promise作为参数，`返回一个新的Promise实例`
2. 只有等到所有的这些参数实例都返回结果，`不管是fulfilled还是rejected，包装实例才会结束`
3. 返回新的Promise实例，一旦结束，状态`总是fulfilled，不会变成rejected`
4. 新的promise实例给监听函数传递一个数组results。该数组的每个成员都是一个对象，对应传入Promise.allSettled的Promise实例。每个对象都有status属性，对应着fulfilled和rejected。fulfilled时，对象有value属性，rejected时有reason属性，对应两种状态的返回值。
5. 当我们不需要关心异步操作的结果，只会关心这些操作有没有结束的时候，这时候`Promise.allSettled`就派上用场了。

### 4.2 原理
```js
const formatSettledResult = (isSuccess, value) => {
  return isSuccess ? ({ status: 'fulfilled', value }) : ({ status: 'rejected', reason: value })
}

Promise.all_settled = function (promises) {
  if (!Array.isArray(promises)) {
    throw new Error('传入的参数必须是数组y')
  }
  let num = 0, len = promises.length, results = Array(len)

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        results[index] = formatSettledResult(true, value)
        if (++num === len) {
          resolve(results)
        }
      })
      .catch((reason) => {
        results[index] = formatSettledResult(false, reason)
        if (++num === len) {
          resolve(results)
        }
      })
    })
  })
}
```
### 4.3 应用场景
1. **并行请求**：当我们需要并行发送多个请求，并在所有请求完成后获得每个请求的结果和状态信息
2. **批量处理**：在等待所有的请求完成后，对各个请求的状态分别进行处理。
3. **处理多个资源加载**：可以将资源的加载封装为promise，并同时加载多个资源，并在加载完后根据promise的状态对每个资源进行对应的处理。

## 5. Promise.cache
### 5.1 介绍
利用promise实例化立即执行的特性可以做请求的缓存。

### 5.2 原理
```js
const cacheMap = new Map()
function enableCache(target, name, descriptor) {
    const val = descriptor.value
    descriptor.value = async function (...args) {
        const cacheKey = name + JSON.stringify(args)
        if (!cacheMap.get(cacheKey)) {
            const cacheValue = Promise.resolve(val.apply(this, args)).catch(() => {
                cacheMap.set(cacheKey, null)
            })
            cacheMap.set(cacheKey, cacheValue)
        }
        return cacheMap.get(cacheKey)
    }
    return descriptor
}

class PromiseClass {
    // 装饰器
    // @enableCache
    static async getInfo() {

    }
}
PromiseClass.getInfo()
PromiseClass.getInfo()
PromiseClass.getInfo()
```
这里我先定义一个`Map`作为`缓存对象`，然后用`方法名`，也就是上面的`getInfo` + `参数序列化后的值`作为`缓存key`值，然后就可以实现请求的缓存了，当然我这里`缓存key`设置的比较简单，实际业务场景肯定会更为严谨一些，然后业务中如果用了缓存的话，需要考虑`缓存失效`的问题，`过快失效和过久不失效`都可能会让程序出现bug，需要注意一下。

### 5.3 应用场景
- 缓存接口请求结果，避免重复请求。
- 也可以用来缓存复杂函数计算结果，提高性能。

## 6. Promise.limit
### 6.1 介绍
`Promise.limit`可以通过promise实现`并发控制`。
### 6.2 原理
```js
function limitLoad(promiseArray, limit) {
    const results = [];
    const promises = promiseArray.slice(0, limit).map((promise, index) => {
        return promise.then((value) => {
            results[index] =  value;
            return index;
        })
    })
    let p = Promise.race(promises)
    for(let i = limit; i < promiseArray.length; i++) {
        p = p.then((index) => {
            promises[index] = promiseArray[i].then((value) => {
                results[i] = value;
                return value
            })
            return Promise.race(promises)
        })
    }
    return p.then(() => results);
}
```
首先，声明一个`results`数组存储`promise结果`，然后先取出`limit`个数的promise，通过`Promise.race`可以拿到最快执行完的那一个，我们前面会把每个`promise`对应在`promises`数组的位置`index`往下传递，然后通过循环`串成一个promise链`，在`Promise.race`的then方法中，通过前面的`index`找到那个`最快执行完的promise所在的位置`，将其替换，最终`promise链`执行完将存储`promise结果`的`results`数组返回就行了。

### 6.3 应用场景
1. **并发请求控制**：有时候为避免`服务器性能问题`，可以使用`Promise.limit`进行`并发控制`，以提高请求的响应速度
2. **批量处理限制**：当对`大量数据`进行处理时，有时候一次性处理会导致服务器内存溢出，这时可以采用`Promise.limit`控制同时处理的`数据数量`，以提高资源的处理效率。
3. **队列调度**：在任务调度和队列管理中，可以使用`Promise.limit`将所有任务放在`固定大小的任务池`中，并限制同时执行的任务数量，这样可以确保任务按照限制的并发度进行顺序执行，避免`资源竞争和过度负载`。

## 7. Promise.try

### 7.1 介绍
`Promise.try`可以把一个函数包装为一个 Promise。

```js
function test(a, b) {
  console.log('调用test', a, b)
  return 'test res';
}

Promise.try(test, 'a', 'b').then((res) => {
  console.log('then', res)
}).catch(() => {
  console.log('catch');
})

/**
 * 打印结果：
 * 调用test a b
 * then test res
 */
```

它也支持传入异步函数，比如 `async` 函数。
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
  }, 3000)
})

async function test(a, b) {
  await p;
  console.log('test', a, b)
  return 'test res';
}

Promise.try(test, 'a', 'b').then((res) => {
  console.log('then', res)
}).catch(() => {
  console.log('catch');
})

/**
 * 先等待3s，然后打印结果如下：
 * 调用test a b
 * then test res
 */
```

### 7.2 原理

```js
Promise.try = function (fn, ...args) {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn(...args))
    } catch (e) {
      reject(e)
    }
  })
}
```

`Promise.try` 的函数签名为 `Promise.try(func, arg1, arg2, ...argN)` ，它会把 `arg1, arg2, ...argN` 作为参数传递给 `func`, 并以同步的方式立即执行 `func` 函数，最后将其结果包装为一个 `Promise` 对象。

### 7.3 应用场景
- 它可以把一个函数包装为一个 `Promise` 对象，比 `new Promise((resolve) => resolve(func()))` 更加简洁。

## 8. Promise.withResolvers

### 8.1 介绍
`Promise.withResolvers` 函数经调用会返回一个新的 `Promise`，以及 `resolve` 和 `reject` 方法。

```js
const { promise, resolve, reject } = Promise.withResolvers()
```
### 8.2 原理
```js
Promise.withResolvers = function () {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
```
### 8.3 应用场景
- 可以替代 `new Promise` 创建 `Promise` 对象，使得 `promise`、`resolve` 和 `reject` 三个变量在同一个作用域中，方便管理。


## 小结
以上给大家介绍了8个 Promise 相关方法以及各自应用场景，其中需要注意 `Promise.try` 和 `Promise.withResolvers` 属于比较新的 `API` ，使用时需注意其兼容性。

如果还有兴趣想掌握`手写Promise` 的话，可以移步我之前写的文章，[前端高频面试题之手写Promise](https://mp.weixin.qq.com/s/l08w1et-bs9piwlYJJCrvg)。
