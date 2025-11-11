## 五、Vue 中的 diff 原理
Vue的diff算法是平级比较，不考虑跨级比较的情况。内部采用**深度递归的方式 + 双指针**的方式进行比较。

比较过程:

1. 先比较是否是相同节点。
2. 相同节点比较属性,并复用老节点。
3. 比较儿子节点，考虑老节点和新节点儿子的情况。
4. 优化比较：头头、尾尾、头尾、尾头。
5. 比对查找进行复用。

Vue3 在这个比较过程的基础上增加了**最长递增子序列**实现diff算法。
- 找出不需要移动的现有节点。
- 只对需要移动的节点进行操作。
- 最小化 DOM 操作次数。


## 六、v-show和v-if的原理

**相同点**：控制元素在页面是否显示。

**不同点**：
- 控制手段不同：`v-show` 控制的是 `css` 的 `display` 属性是否为 `none` 来控制元素的是否隐藏，而 `v-if` 是直接不渲染 DOM 元素或者直接删除 DOM 元素。
- 控制过程区别：`v-if` 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件，如果控制的是组件，也会执行组件的生命周期钩子；而`v-show` 只是简单的基于css切换。
- 编译区别：`v-if` 在编译过程中会被转化成**三元表达式**,条件不满足时不渲染此节点。`v-show` 会被编译成指令，条件不满足时控制样式将对应节点隐藏 （内部其他指令依旧会继续执行）。
- 性能消耗：`v-if` 比 `v-show` 有更高的性能消耗。

**使用场景**：频繁切换 + 不需要销毁状态用 `v-show`，反之用 `v-if`。

v-if 源码：
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

## 七、v-if 和 v-for  哪个优先级更高？
- vue2 中 `v-for` 的优先级比 `v-if` 高，它们作用于一个节点上会导致先循环后对每一项进行判断，浪费性能。
- vue3 中 `v-if` 的优先级比 `v-for` 高，这就会导致 `v-if` 中的条件无法访问 `v-for` 作用域名中定义的变量别名。

```vue
<li v-for="item in arr" v-if="item.visible">
  {{ item}}
</li>
```

以上代码在 `vue3` 的编译结果如下：
```js
import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createCommentVNode as _createCommentVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.item.visible)
    ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(_ctx.arr, (item) => {
        return (_openBlock(), _createElementBlock("li", null, _toDisplayString(item), 1 /* TEXT */))
      }), 256 /* UNKEYED_FRAGMENT */))
    : _createCommentVNode("v-if", true)
}
```

可以看出 `vue3` 在编译时会先判断 `v-if`，然后再走 `v-for` 的循环，所以在 `v-if` 中自然就无法访问 `v-for` 作用域名中定义的变量别名。

这样的写法在 vue3 中会抛出一个警告⚠️，`[Vue warn]: Property "item" was accessed during render but is not defined on instance`，导致渲染失败。

以上代码在 `vue2` 还不能直接编译，因为 `vue2` 的组件需要一个根节点，所以我们在外层加一个 `div`：
```js
<div>
  <li v-for="item in arr" v-if="item.visible">
    {{ item}}
  </li>
</div>
```

其编译结果如下：
```js
function render() {
  with(this) {
    return _c('div', _l((arr), function (item) {
      return (item.visible) ? _c('li', [_v("\n    " + _s(item) + "\n  ")]) :
        _e()
    }), 0)
  }
}
```
很明显是先循环 `arr`，然后每一项再用 `item.visible` 去判断的，也印证了在 `vue2` 中， `v-for` 的优先级高于 `v-if`。

> 所以不管是 `vue2` 还是 `vue3`，都不推荐同时使用 `v-if` 和 `v-for`，更好的方案是采用计算属性，或者在外层再包裹一个容器元素，将 `v-if` 作用在容器元素上。

## nextTick 的使用场景

## 九、Vue.set方法是如何实现的?
**Vue2的实现**：在 Vue 2 中，Vue.set 的实现主要位于 `src/core/observer/index.js` 中：
```ts
export function set (target: Array | Object, key: any, val: any): any {
    // 1.如果是数组 Vue.set(array,1,100); 调用我们重写的splice方法 (这样可以更新视图)
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    // 2.如果是对象本身的属性，则直接添加即可
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target: any).__ob__
    // 3.如果是响应式的也不需要将其定义成响应式属性
    if (!ob) {
        target[key] = val
        return val
    }
    // 4.将属性定义成响应式的
    defineReactive(ob.value, key, val)
    // 5.通知视图更新
    ob.dep.notify()
    return val
}
```

Vue3 中 set 方法已经被移除，因为 proxy 天然弥补 vue2 响应式的缺陷。

## Vue的组件渲染流程?
1. 在渲染父组件时会创建父组件的虚拟节点,其中可能包含子组件的标签
2. 在创建虚拟节点时,获取组件的定义使用Vue.extend生成组件的构造函数。
3. 将虚拟节点转化成真实节点时，会创建组件的实例并且调用组件的$mount方法。
4. 所以组件的创建过程是先父后子。

## Vue.use是干什么的?原理是什么?
Vue.use 是用来使用插件的，我们可以在插件中扩展全局组件、指令、原型方法等。

Vue.use 源码：

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


## 三、Vue中模板编译原理？
Vue 中的模板编译就是把我们写的 `template` 转换为渲染函数(`render function`) 的过程，它主要经历3个步骤：
1. **解析（Parse）**：将 template 模板转换成 ast 抽象语法树。
2. **优化（Optimize）**：对静态节点做静态标记，减少 diff 过程中的比对。
3. **生成（Generate）**：重新生成代码，将 ast 抽象语法数转化成可执行的渲染函数代码。

### 3.1 解析阶段
```html
<div id="app">
  <p>{{ message }}</p>
</div>
```

- 用 HTML 解析器将模板解析为 AST。
- AST中用 js 对象描述模板，里面包含了元素类型、属性、子节点等信息。
- 解析指令（`v-for、v-if`）和事件（`@click`）、插值表达式`{{}}`等 vue 语法。

### 3.2 优化阶段
- 遍历上一步生成的 ast，标记静态节点，比如用 `v-once` 的节点，以及没有用到响应式数据的节点。
- 标记静态根节点，避免不必要的渲染。


### 3.3 代码生成阶段

vue2 解析结果：
```js
function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('p', [_v(_s(message))])])
  }
}
```
- `_c`: 是 createElement 的别名，用于创建 VNode。
- `_v`: 创建文本 VNode。
- `_s`: 是 toString 的别名，用于将值转换为字符串。

vue3 解析结果：
```js
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", { id: "app" }, [
    _createElementVNode("p", null, _toDisplayString(_ctx.message), 1 /* TEXT */)
  ]))
}
```
- `_openBlock`: 开启一个"block"区域，用于收集动态子节点。
- `_createElementBlock`: 创建一个块级虚拟 DOM 节点。
- `_createElementVNode`: 创建一个普通虚拟 DOM 节点。
- `_toDisplayString`: 将响应式数据 _ctx.message 转换为显示字符串，或者处理 null/undefined 等值，确保它们能正确渲染为空白字符串。

vue2在线编译：[https://template-explorer.vuejs.org/](https://template-explorer.vuejs.org/)。

vue3在线编译：[https://v2.template-explorer.vuejs.org/](https://v2.template-explorer.vuejs.org/)。

### 运行时+编译(runtime-compiler) vs 仅运行时(runtime-only)
1. 完整版（运行时+编译）：
    - 包含编译模块，可以写 template 模版。
    - 体积较大（～30kb）。
2. 仅运行时版本
    - 需要在打包时使用 `vue-loader` 进行编译。
    - 体积较小（～20kb）。
    
平时开发项目推荐使用仅运行时(runtime-only)版本。

### 编译后的特点
1. 虚拟DOM：渲染函数生成的是虚拟DOM节点(VNode)。
2. 响应式绑定：渲染函数中的变量会自动建立依赖关系。
3. 性能优化：通过静态节点标记减少不必要的更新。


## Vue.mixin的使用场景和原理？（Vue2）
Vue.mixin 的作用就是抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则”以组件的数据为准。

mixin 中有很多缺陷 "命名冲突问题"、"依赖问题"、"数据来源问题",注意 mixin 的数据是不会被共享的！


## Vue.js 中的函数式组件、异步组件和递归组件

## Vue.js 如何自定义插件

## Vue.js 应用中常见的内存泄漏来源有哪些？

## Vue.js 中的 Vue-loader 是什么？

## Vue.extend 方法的作用？

## keep-alive 的原理

## 自定义指令

## 性能优化
Vue2 中数据层级不易过深，合理设置响应式数据；
Vue2 非响应式数据可以通过 Object.freeze()方法冻结属性；
Vue2 中采用函数式组件 -> 函数式组件开销低；
使用数据时缓存值的结果，不频繁取值；
合理设置 Key 属性；
v-show 和 v-if 的选取；
控制组件粒度 -> Vue 采用组件级更新；
采用异步组件 -> 借助构建工具的分包的能力；
合理使用keep-alive 、v-once、v-memo 进行逻辑优化；
分页、虚拟滚动、时间分片等策略...

## Vue 中使用了哪些设计模式?

## 如何自定义 v-model ？

`v-model` 实际上是一个语法糖，它结合了 `value` prop 和 `input` 事件，可以实现数据的**双向绑定**。

## 自定义watch和取消watch


## ssr