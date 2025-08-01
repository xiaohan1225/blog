---
title: 002 Vue3响应式原理
date: 2022-06-17
categories:
  - Vue
tags:
  - Vue3.0
sidebar: "auto"
---

## Object.defineProperty和Proxy
vue2.0的响应式是通过`Object.defineProperty`对对象属性重写`get`和`set`来实现的，而这个API是有一些缺陷的：
1. 深度递归，性能消耗大
2. 无法拦截新增和删除属性
3. 无法拦截原生数组索引操作

所以Vue3换成了`Proxy`，它是从对象层面进行拦截的，所以它能解决`Object.defineProperty`这三个缺陷，但它也有缺点，就是兼容性很差，而且不能被polyfill，正因如此vue3.0不支持IE。

## effect函数
effect函数指的是副作用函数，当它执行时，会读取外部状态，从而产生副作用。
```js
const obj = { a: 1 }
effect(() => {
  document.body.innerText = obj.a
})
```
如上所示，effect函数会默认执行传入的回调函数，从而读取obj.a的值，而当obj.a的值发生变化时，我们希望effect会重新执行。
> vue3中effect和响应式数据的关系就跟vue2中dep和watcher的关系类似。

## 响应式数据
vue3中的响应式是由`reactivity`包来实现的。

我们可以用`proxy`对数据进行拦截，将其包装为响应式数据，在取值时将当前的数据和effect关联起来，当数据发生变化时，重新执行effect。

```js
let activeEffect = null
const data = { a: 1 }

// 这里简单实现下effect
const effect = (fn) => {
    if (fn) {
        fn()
        effect.run = fn
    } else {
        effect.run()
    }
}
const proxyData = new Proxy(data, {
    get(target, key) {
        activeEffect = effect
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        activeEffect()
    }
})
effect(() => {
    console.log(proxyData.a)
})

setTimeout(() => {
    proxyData.a = 2
}, 1000)
```

不过当响应式数据多了之后，这样用一个变量去收集依赖的方式就不行了，vue3采用的是下面的结构来收集依赖。

![图片加载失败](../../assets/images/vue/vue3/vue3依赖存储结构.png)

假设数据为{ a: 1, b: 2 }，最外层用`WeakMap`来存储，key为`原生对象target`, value为`map`，`map`的key为`原生对象`的key值，value为一个`Set对象`，里面用来存储与属性相关联的`effect`。

> 最外层选用`WeakMap`的原因是它是`弱引用`，不会造成内存泄露，`set`是为了保证`effect`唯一。

vue3中实现响应式常用的是`reactive`方法。
```js
import { isObject } from "@vue/shared"
function createReactiveObject(target: object, isReadonly: boolean) {
    if (!isObject(target)) {
        return target
    }
}
// reactive：传入一个普通对象返回一个响应式的代理对象
export function reactive(target: object) {
    return createReactiveObject(target, false)
}
// 后面的方法，shallow表示只代理一层，readonly表示只读，这里先不实现... 
/*
export function shallowReactive(target: object) {
    return createReactiveObject(target, false)
}
export function readonly(target: object) {
    return createReactiveObject(target, true)
}
export function shallowReadonly(target: object) {
    return createReactiveObject(target, true)
}
*/
```

```js
const reactiveMap = new WeakMap(); // 依赖收集容器
const mutableHandlers: ProxyHandler<object> = {
    get(target, key, receiver) {
        // 依赖收集逻辑 TODO
        const res = Reflect.get(target, key, receiver);
        return res;
    },
    set(target, key, value, receiver) {
        // 重新触发effect执行逻辑 TODO
        const result = Reflect.set(target, key, value, receiver);
        return result;
    }
}
function createReactiveObject(target: object, isReadonly: boolean) {
    if (!isObject(target)) {
        return target
    }
    // 同一个对象不需要代理多次
    const exisitingProxy = reactiveMap.get(target);
    if (exisitingProxy) {
        return exisitingProxy;
    }
    // 对对象进行代理
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target,proxy)
    return proxy;
}
```
> 使用`Reflect`保证取值时this指向代理对象。

## effect原理
```js
// 当前正在执行的effect
export let activeEffect = undefined;

class ReactiveEffect {
    active = true;
    deps = []; // 收集effect中使用到的属性
    parent = undefined;
    constructor(public fn) { }
    run() {
        if (!this.active) { // 不是激活状态
            return this.fn();
        }
        try {
            this.parent = activeEffect; // 当前的effect就是他的父亲
            activeEffect = this; // 设置成正在激活的是当前effect
            return this.fn();
        } finally {
            activeEffect = this.parent; // 执行完毕后还原activeEffect
            this.parent = undefined;
        }

    }
}
export function effect(fn, options?) {
    const _effect = new ReactiveEffect(fn); // 创建响应式effect
    _effect.run(); // 让响应式effect默认执行
}
```

## 依赖收集

```js
get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
    }
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key);  // 依赖收集
    return res;
}
```

```js
const targetMap = new WeakMap(); // 记录依赖关系
export function track(target, type, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target); // {对象：map}
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set())) // {对象：{ 属性 :[ dep, dep ]}}
        }
        let shouldTrack = !dep.has(activeEffect)
        if (shouldTrack) {
            dep.add(activeEffect);
            activeEffect.deps.push(dep); // 让effect记住dep，这样后续可以用于清理
        }
    }
}
```

## 触发更新
```js
set(target, key, value, receiver) {
    // 等会赋值的时候可以重新触发effect执行
    let oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
        trigger(target, 'set', key, value, oldValue)
    }
    return result;
}
```

```js
export function trigger(target, type, key?, newValue?, oldValue?) {
    const depsMap = targetMap.get(target); // 获取对应的映射表
    if (!depsMap) {
        return
    }
    const effects = depsMap.get(key);
    effects && effects.forEach(effect => {
        if (effect !== activeEffect) effect.run(); // 防止循环
    })
}
```

## 分支切换与cleanup
在effect中可能会有条件判断，所以每次重新执行effect时需要**删除依赖并重新收集**。
```js
const state = reactive({ flag: true, a: 1, b: 2 })
effect(() => { // 副作用函数 (effect执行渲染了页面)
    console.log('render')
    document.body.innerHTML = state.flag ? state.a : state.b
});
setTimeout(() => {
    state.flag = false;
    setTimeout(() => {
        console.log('修改name，原则上不更新')
        state.a = 3
    }, 1000);
}, 1000)
```

```js
// 清理effect
function cleanupEffect(effect) {
    const { deps } = effect;
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect);
    }
    effect.deps.length = 0;
}
class ReactiveEffect {
    active = true;
    deps = [];
    parent = undefined;
    constructor(public fn) { }
    run() {
        try {
            this.parent = activeEffect; 
            activeEffect = this;
            // 新增清空依赖逻辑
+           cleanupEffect(this);
            return this.fn();
        }
    }
}
```

> 注意：由于在当前effect时同时执行了`set.delete(effect)`和`set.add(effect)`，会导致死循环，所以遍历前可以先拷贝一份

```js
export function trigger(target, type, key?, newValue?, oldValue?) {
    const depsMap = targetMap.get(target); // 获取对应的映射表
    if (!depsMap) {
        return
    }
    const effects = depsMap.get(key);
    // 使用new Set拷贝一份
    effects && (new Set(effects)).forEach(effect => {
        if (effect !== activeEffect) effect.run(); // 防止循环
    })
}
```

## 停止effect
执行effect会返回ReactiveEffect的实例，而这个实例上会提供一个stop方法，可以清空依赖以及停止依赖收集。

```js
export class ReactiveEffect {
    stop(){
        if(this.active){ 
            cleanupEffect(this);
            this.active = false
        }
    }
}
export function effect(fn, options?) {
    const _effect = new ReactiveEffect(fn); 
    _effect.run();

    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner; // 返回runner
}
```

## 调度执行
有时候trigger触发时，我们需要自行决定副作用函数执行的时机、次数、及执行方式
```js
export function effect(fn, options:any = {}) {
    const _effect = new ReactiveEffect(fn,options.scheduler); // 创建响应式effect
    // if(options){
    //     Object.assign(_effect,options); // 扩展属性
    // }
    _effect.run(); // 让响应式effect默认执行
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner; // 返回runner
}

export function trigger(target, type, key?, newValue?, oldValue?) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return
    }
    let effects = depsMap.get(key);
    if (effects) {
        effects = new Set(effects);
        for (const effect of effects) {
            if (effect !== activeEffect) { 
                // 如果有调度函数则执行调度函数
                if(effect.scheduler){ 
                    effect.scheduler()
                }else{
                    effect.run(); 
                }
            }
        }
    }
}
```

## 深度代理
vue3的响应式是**懒递归**的，只代理一层，当取出的值是对象时，再去代理下一层。
```js
 get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
    }
    const res = Reflect.get(target, key, receiver);
    track(target, 'get', key);

    // 代理下一层
    if(isObject(res)){
        return reactive(res);
    }
    return res;
}
```

