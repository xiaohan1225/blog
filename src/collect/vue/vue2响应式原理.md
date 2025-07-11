
![图片加载失败](../../assets/images/vue/vue2/响应式原理.png)

## 前言
我们都知道，`Vue`的特点之一就是`数据驱动视图`，就是说数据发生变化之后，视图会进行更新，这背后的原理就是vue的响应式系统。应用在运行时需要不断地进行渲染，而响应式系统的任务就是`让视图随着状态的变化而变化`。接下来探索一下Vue2.0的响应式原理。

## 正文
### 1.如何监听对象变化？
对于JavaScript对象来说，如何侦测一个对象的变化？

这主要有两种方式，一个是使用`Object.defineProperty`，另一个是ES6提供的`Proxy`。而`Proxy`在浏览器的支持度并不理想，所以vue2.0当时实现的时候采用了`Object.defineProperty`，重写属性的代码如下:
```js
function defineReactive(data, key, val) {
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            return val
        },
        set(newVal) {
            if (newVal === val) return
            val = newVal
        }
    })
}
```

我们定义一个`defineReactive`函数，用`闭包`保留一个`val`，当页面取值的时候，会走到`get`函数，返回`val`，数据改变会触发`set`函数，修改`val`。

### 2.如何监听数组变化？
我们都知道，数组其实也是对象，同样可以用`Object.defineProperty`劫持数组的每一项，但如果数组有100万项，那就要调用`Object.defineProperty`一百万次，这样的话性能太低了。鉴于平时我们操作数组大都是采用数组提供的原生方法，于是Vue对数组重写原型链，在调用7个能改变自身的原生方法(`push`，`pop`，`shift`，`unshift`，`splice`，`sort`，`reverse`)时，通知页面进行刷新，具体实现过程如下：
```js
// 先拿到数组的原型
const oldArrayProtoMethods = Array.prototype
// 用Object.create创建一个以oldArrayProtoMethods为原型的对象
const arrayMethods = Object.create(oldArrayProtoMethods)
const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]
methods.forEach(method => {
    // 给arrayMethods定义7个方法
    arrayMethods[method] = function (...args){
        // 先找到数组对应的原生方法进行调用
        const result = oldArrayProtoMethods[method].apply(this, args)
        // 声明inserted，用来保存数组新增的数据
        let inserted
        // __ob__是Observer类实例的一个属性，data中的每个对象都是一个Observer类的实例
        const ob = this.__ob__
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
            default:
                break
        }
        // 比如有新增的数据，新增数据也要被定义为响应式
        if(inserted) ob.observeArray(inserted)
        // 通知页面更新
        ob.dep.notify()
        return result
    }
})
```

### 3.如何收集依赖以及依赖更新？
在Vue的响应式系统中，有三个核心类，它们分别是
1. `Observer`：我们data中的每个对象会返回一个Observer类的实例；
2. `Dep`：对象中每个属性会创建一个Dep，另外每一个对象还会单独创建一个Dep；
3. `Watcher`：也就是`依赖`，Watcher有三种
  - `渲染Watcher`：Vue会为每个组件会创建一个渲染Watcher（函数式组件除外）；
  - `用户Watcher`：我们自己在watch对象中写的watch；
  - `计算属性Watcher`：我们自己定义的计算属性，最终也是靠Watcher来实现的；

步骤：
1. 创建渲染`Watcher`，默认会调用this.get方法
2. 将当前渲染`Watcher`保存在Dep.target上
3. 调用vm._render，会去data上取值，走到`get`方法，并将当前属性的`Dep`和Dep.target的渲染Watcher进行关联，
4. 当数据更新时，会走到数据的`set`方法，`set`方法中会调用`Dep.notify`方法，找到当前Dep依赖的Watcher，调用watcher.update方法
5. 重新调用vm._render进行取值。

### 4.整体流程
1. 遍历data中的数据，如果是`obj`就创建一个`Observer`实例，`new Observer(obj)`
2. 给当前对象增加一个`Dep实例`，并当前实例保存在`__ob__`属性上，`this.__ob__ = this`，表示当前属性已经被代理
3. 判断传入对象是不是数组，如果是数组则重写原型链，拦截`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`七个方法，并调用observeArray遍历数组，将数组的每一项的对象定义为响应式
4. 如果不是数组则是对象，则调用`walk`方法循环对象，对每个属性调用`defineReactive`方法，在`defineReactive`方法中会为当前属性创建一个`Dep`实例，并调用`Object.defineProperty`进行重新定义`get`
5. 创建`渲染Watcher`进行页面渲染，将当前Watcher放到`Dep.target`上，`Dep.target = [Watcher]`
6. 调用`vm._render`，会取值，走到`get`方法，将`Dep`和`target`关联，再调用`vm._update`将虚拟节点创建为真实节点并渲染到页面上
6. 数据更新，走到`set`方法，调用`Dep.notify`方法，找到当前`Dep`收集的`Watcher`，调用`Watcher.update`
7. 重新调用`vm._render`,再调用`vm._update`将虚拟节点创建为真实节点并渲染到页面上


### 5.Object.defineProperty的缺点
1. 无法监听新增属性和删除属性的变化
2. 监测数组的索引性能太低，故而直接通过数组索引改值无法触发响应式
3. 初始化时需要一次性递归调用，性能较差

### 6.proxy和Object.defineProperty对比
- `Vue3.0`的proxy：代理`对象`，能监听到对象新增属性和删除属性，以及数组的索引和length变化，可以进行懒递归，性能较好，
- `Vue2.0`的Object.defineProperty: 代理`属性`，只能能监听到对象已有的属性，监听数组索引性能消耗大，不能进行懒递归，性能较差。
