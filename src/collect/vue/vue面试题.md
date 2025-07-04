## 说说你对vue的理解？
`vue` 是一个用于创建用户界面的开源 `JavaScript` 框架，它的特点如下：

### 1. 声明式框架
- 早在JQ的时代编写的代码都是命令式的，命令式框架重要特点就是关注过程，
- 声明式框架更加关注结果。命令式的代码封装到了框架内部，过程靠框架来实现

### 2. 数据驱动/响应式数据
通过 `Object.defineProperty（Vue 2` 或 `Proxy（Vue 3）` 实现数据劫持，数据变化时自动更新视图，开发者无需手动操作 DOM。

### 3. 虚拟DOM
通过高效的 `Diff` 算法比对虚拟 `DOM` 的变化，最小化真实 `DOM` 操作，提升性能。
### 4. 组件化
将 UI 拆分为独立可复用的组件，每个组件包含自己的模板、逻辑和样式，通过组合组件构建复杂应用。

### 5. 组件化
提供 `v-if`、`v-for`、`v-bind`、`v-on` 等指令，以声明式方式增强 HTML 的功能。

### 6. 渐进式框架
- 渐进集成：可以从小规模功能（如静态页面交互）逐步扩展到完整的单页应用（SPA）。
- 灵活生态：核心库只关注视图层，但配合官方路由（Vue Router）、状态管理（Vuex/Pinia）、构建工具（Vite）等，能轻松扩展为全功能框架。

就是你可以单独用 `vue` 的响应式构建静态页面，如果你需要状态管理，就上官方的状态管理工具 `Vuex/Pinia`，如果你需要构建一个应用，有多个页面，可以上官方路由 `Vue-router`，如果你需要一键生成项目，可以用官方的 `vue-cli` 一键创建项目。

## 请说一下响应式数据的理解？
### vue2响应式
对象内部通过defineReactive方法，使用Object.defineProperty将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组的七个方法`（push,shift,pop,splice,unshift,sort,reverse）`来实现。 如果想更改索引更新数据,可以用 `Vue.$set` 来实现，其实内部用的就是 `splice` 方法。

所以vue2的性能优化：
- 对象层级过深，性能就会差
- 不需要响应数据的内容不要放到data中
- 可以用 `Object.freeze()` 冻结数据

### Vue中模板编译原理？
1. 将template模板转换成ast语法树 - parserHTML
2. 对静态语法做静态标记 - markUp
3. 重新生成代码 - codeGen

模板引擎的实现原理就是 `new Function + with` 来进行实现的.

vue-loader中处理template属性主要靠的是vue-template-compiler模块

## Vue.mixin的使用场景和原理？
Vue.mixin的作用就是抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用mergeOptions方法进行合并，采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则”以组件的数据为准。

mixin中有很多缺陷 "命名冲突问题"、"依赖问题"、"数据来源问题",注意mixin的数据是不会被共享的！

## Vue为什么需要虚拟DOM？
Virtual DOM就是用js对象来描述真实DOM，是对真实DOM的抽象，由于直接操作DOM性能低但是js层的操作效率高，可以将DOM操作转化成对象操作，最终通过diff算法比对差异进行更新DOM（减少了对真实DOM的操作）。虚拟DOM不依赖真实平台环境从而也可以实现跨平台。

## Vue中的diff原理
Vue的diff算法是平级比较，不考虑跨级比较的情况。内部采用深度递归的方式 + 双指针的方式进行比较。

Vue2比较过程:

1. 先比较是否是相同节点
2. 相同节点比较属性,并复用老节点
3. 比较儿子节点，考虑老节点和新节点儿子的情况
4. 优化比较：头头、尾尾、头尾、尾头
5. 比对查找进行复用

 Vue3中采用最长递增子序列实现diff算法。

## v-show和v-if有什么区别？使用场景分别是什么？

相同点：控制元素在页面是否显示

不同点：
- 控制手段不同：`v-show` 控制的是 `css` 的 `display` 属性是否为 `none` 来控制元素的是否隐藏，而 `v-if` 是直接不渲染 DOM 元素或者直接删除 DOM 元素。
- 控制过程区别：`v-if` 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件，如果控制的是组件，也会执行组件的生命周期钩子；而`v-show` 只是简单的基于css切换。
- 编译区别：`v-if` 在编译过程中会被转化成**三元表达式**,条件不满足时不渲染此节点。`v-show` 会被编译成指令，条件不满足时控制样式将对应节点隐藏 （内部其他指令依旧会继续执行）。
- 性能消耗：`v-if` 比 `v-show` 有更高的性能消耗。

使用场景：频繁切换 + 不需要销毁状态用 `v-show`，反之用 `v-if`。

v-if 源码
```js
function genIfConditions (
    conditions: ASTIfConditions,
    state: CodegenState,
    altGen?: Function,
    altEmpty?: string
    ): string {
    if (!conditions.length) {
        return altEmpty || '_e()'
    }
    const condition = conditions.shift()
    if (condition.exp) {   // 如果有表达式
        return `(${condition.exp})?${ // 将表达式作为条件拼接成元素
        genTernaryExp(condition.block)
        }:${
        genIfConditions(conditions, state, altGen, altEmpty)
        }`
    } else {
        return `${genTernaryExp(condition.block)}` // 没有表达式直接生成元素 像v-else
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp (el) {
        return altGen
        ? altGen(el, state)
        : el.once
            ? genOnce(el, state)
            : genElement(el, state)
    }
}
```

v-show 源码：
```js
{
    bind (el: any, { value }: VNodeDirective, vnode: VNodeWithData) {
    const originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display // 获取原始显示值
        el.style.display = value ? originalDisplay : 'none' // 根据属性控制显示或者隐藏
    }  
} 
```

## Vue中computed和watch的区别
computed和watch都是基于Watcher来实现的，分别是计算属性watcher和用户watcher。computed属性是具备缓存的，依赖的值不发生变化，对其取值时计算属性方法不会重新执行（可以用模板渲染，取值的过程中不支持异步方法）watch则是监控值的变化，当值发生变化时调用对应的回调函数。

computed不会立即执行，内部通过defineProperty进行定义。并且通过dirty属性来检测依赖的数据是否发生变化。watch则是立即执行将老值保存在watcher上，当数据更新时重新计算新值，将新值和老值传递到回调函数中。

## Vue.set方法是如何实现的?
我们给对象和数组本身都增加了dep属性。当给对象新增不存在的属性则触发对象依赖的watcher去更新，当修改数组索引时我们调用数组本身的splice方法去更新数组。

```ts
export function set (target: Array | Object, key: any, val: any): any {
    // 1.是开发环境 target 没定义或者是基础类型则报错
    if (process.env.NODE_ENV !== 'production' &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
    }
    // 2.如果是数组 Vue.set(array,1,100); 调用我们重写的splice方法 (这样可以更新视图)
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    // 3.如果是对象本身的属性，则直接添加即可
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target: any).__ob__
    // 4.如果是Vue实例 或 根数据data时 报错
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
        )
        return val
    }
    // 5.如果不是响应式的也不需要将其定义成响应式属性
    if (!ob) {
        target[key] = val
        return val
    }
    // 6.将属性定义成响应式的
    defineReactive(ob.value, key, val)
    // 7.通知视图更新
    ob.dep.notify()
    return val
}
```

## Vue的生命周期方法有哪些？一般在哪一步发起请求及原因
- beforeCreate 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
- created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el
- beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。
- mounted el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
- beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
- updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
- beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。
- destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。

钩子函数的作用:

- created 实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。(服务端渲染支持created方法)
- mounted 实例已经挂载完成，可以进行一些DOM操作
- beforeUpdate 可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
- updated 可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用。
- destroyed 可以执行一些优化操作,清空定时器，解除绑定事件

在哪发送请求都可以，主要看具体你要做什么事，一般会在 `created` 和 `mounted` 发起请求，但注意服务端渲染不执行 `mounted` 钩子。


## Vue组件间传值的方式及之间的区别
- props和$emit 父组件向子组件传递数据是通过prop传递的，子组件传递数据给父组件是通过$emit触发事件来做到的
- $parent,$children 获取当前组件的父组件和当前组件的子组件
- $attrs和$listeners A->B->C。Vue 2.4 开始提供了$attrs和$listeners来解决这个问题
- 父组件中通过provide来提供变量，然后在子组件中通过inject来注入变量。
- $refs 获取实例
- event bus 平级组件数据传递 这种情况下可以使用中央事件总线的方式
- vuex状态管理

## Vue的组件渲染流程?
1. 在渲染父组件时会创建父组件的虚拟节点,其中可能包含子组件的标签
2. 在创建虚拟节点时,获取组件的定义使用Vue.extend生成组件的构造函数。
3. 将虚拟节点转化成真实节点时，会创建组件的实例并且调用组件的$mount方法。
4. 所以组件的创建过程是先父后子

## Vue中组件的data为什么是一个函数?

每次使用组件时都会对组件进行实例化操作，并且调用data函数返回一个对象作为组件的数据源。这样可以保证多个组件间数据互不影响

## Vue.use是干什么的?原理是什么?
Vue.use是用来使用插件的，我们可以在插件中扩展全局组件、指令、原型方法等。

Vue.use源码：

```js
Vue.use = function (plugin: Function | Object) {
    // 插件不能重复的加载
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)  // install方法的第一个参数是Vue的构造函数，其他参数是Vue.use中除了第一个参数的其他参数
    if (typeof plugin.install === 'function') { // 调用插件的install方法
        plugin.install.apply(plugin, args)  Vue.install = function(Vue,args){}
    } else if (typeof plugin === 'function') { // 插件本身是一个函数，直接让函数执行
        plugin.apply(null, args) 
    }
    installedPlugins.push(plugin) // 缓存插件
    return this
}
```
