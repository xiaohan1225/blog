## 1、说一下 Vue.js 的响应式原理

### 1.1 Vue2 响应式原理
核心原理就是通过 `Object.defineProperty` 对对象属性进行劫持，重新定义对象的 `getter` 和 `setter`，在 `getter` 取值时收集依赖，在 `setter` 修改值时触发依赖更新，更新页面。

Vue2 对数组和对象做了两种不同方式的处理。

**监听对象变化：**

针对对象来说，Vue 会循环遍历对象的每一个属性，用 defineReactive 重新定义 `getter` 和 `setter`。

```js

function defineReactive(target,key,value){
    observer(value);
    Object.defineProperty(target,key,{ ¸v
        get(){
            // ... 收集依赖逻辑
            return value;
        },
        set(newValue){
            if (value !== newValue) {
                value = newValue;
                observer(newValue) // 把新设置的值包装成响应式
            }
            // ...触发依赖更新逻辑
        }
    })
}
function observer(data) {
    if(typeof data !== 'object'){
        return data
    }
    for(let key in data){
        defineReactive(data,key,data[key]);
    }
}
```

**监听数组变化：**

我们都知道，数组其实也是对象，同样可以用 `Object.defineProperty` 劫持数组的每一项，但如果数组有100万项，那就要调用 `Object.defineProperty` 一百万次，这样的话性能太低了。鉴于平时我们操作数组大都是采用数组提供的原生方法，于是 Vue 对数组重写原型链，在调用7个能改变自身的原生方法(`push`，`pop`，`shift`，`unshift`，`splice`，`sort`，`reverse`)时，通知页面进行刷新，具体实现过程如下：
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

**Object.defineProperty的缺点：**
1. 无法监听新增属性和删除属性的变化，需要通过 `$set`、`$delete` 实现。
2. 监测数组的索引性能太低，故而直接通过数组索引改值无法触发响应式。
3. 初始化时需要一次性递归调用，性能较差。

### 1.2 Vue3 的响应式改进
Vue3 采用 `Proxy + Reflect` 配合实现响应式。能解决上述 `Object.defineProperty` 的所有缺陷，唯一缺点就是兼容性没有 `Object.defineProperty` 好。
```js
let handler = {
  get(target, key) {
    if (typeof target[key] === "object") {
      return new Proxy(target[key], handler);
    }
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    let oldValue = target[key];
    if (oldValue !== value) {
      return Reflect.set(target, key, value);
    }
    return true;
  },
};
let proxy = new Proxy(obj, handler);
```

## 2、介绍一下 Vue 中的 diff 算法？
Vue 的 diff 算法是平级比较，不考虑跨级比较的情况。内部采用**深度递归的方式 + 双指针**的方式进行比较。

**比较过程:**

1. 先比较是否是相同节点。
2. 相同节点比较属性,并复用老节点。
3. 比较儿子节点，考虑老节点和新节点儿子的情况。
4. 优化比较：头头、尾尾、头尾、尾头。
5. 比对查找进行复用。

Vue3 在这个比较过程的基础上增加了**最长递增子序列**实现diff算法。
- 找出不需要移动的现有节点。
- 只对需要移动的节点进行操作。
- 最小化 DOM 操作次数。

## 3、Vue 的模板编译原理是什么？
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

**运行时+编译(runtime-compiler) vs 仅运行时(runtime-only)：**
1. 完整版（运行时+编译）：
    - 包含编译模块，可以写 template 模版。
    - 体积较大（～30kb）。
2. 仅运行时版本
    - 需要在打包时使用 `vue-loader` 进行编译。
    - 体积较小（～20kb）。
    
平时开发项目推荐使用仅运行时(runtime-only)版本。

**编译后的特点：**
1. **虚拟DOM**：渲染函数生成的是虚拟DOM节点(VNode)。
2. **响应式绑定**：渲染函数中的变量会自动建立依赖关系。
3. **性能优化**：通过静态节点标记减少不必要的更新。


## 4、v-show 和 v-if 的原理

简单来说，`v-if` 内部是通过一个三元表达式来实现的，而 `v-show` 则是通过控制 DOM 元素的 `display` 属性来实现的。

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

## 5、v-if 和 v-for  哪个优先级更高？为什么？
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

## 6、nextTick 的原理是什么？
### 6.1 Vue2 的 nextTick：
- 首选微任务：
  - **Promise.resolve().then(flushCallbacks)**：最常见，使用 Promise 创建微任务。
  - **MutationObserver**：如果 Promise 不可用，创建一个文本节点，修改其内容触发 MutationObserver 的观察器回调。
- 回退宏任务：
  - **setImmediate**：如果环境支持 setImmediate，比如 node 环境，则会优先使用 setImmediate 。
  - **setTimeout(flushCallbacks, 0)**：最后使用定时器。

这里体现了**优雅降级**的思想。

### 6.2 Vue3 的 nextTick：
- 由于 Vue3 不再考虑 promise 的兼容性，所以 nextTick 的实现原理就是 promise.then 方法。

## 7、Vue.set 方法是如何实现的?
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


## 8、Vue.use 是干什么的?原理是什么?
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

## 9、介绍下 Vue 中的 mixin，Vue3 为何不再推荐使用它？
mixin 是 Vue 2 中一种复用组件逻辑的方式，允许将可复用的配置（data、methods、computed、lifecycle hooks 等）抽离成一个对象，然后通过 mixins: [] 合并到组件中。支持全局注入和局部注入。
- 作用：抽离公共的业务逻辑
- 原理：类似“对象的继承”，当组件初始化时会调用 `mergeOptions` 方法进行合并，采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则”以组件的数据为准。

**mixin 的优点：**
- 复用逻辑（如表单验证、权限判断）。
- 全局注入（如日志、埋点）。
- 减少重复代码。

**mixin 中有很多缺陷：**
- 命名冲突问题：mixin 中的变量、函数名可能会与组件中的重名。
- 依赖问题：
- 数据来源问题：

**vue3 不再推荐使用它的理由如下：**

| 问题 | 说明 |
|---------|---------|
| **1. 隐式依赖 & 数据来源不明确**   | 组件行为来自多个 mixin，难以追踪 data、methods 是从哪里来的。   |
| **2. 命名冲突**   | 多个 mixin 可能定义同名 data、methods，合并规则复杂（同名 methods 后者覆盖前者，data 合并为对象，同名 Key 后者覆盖前者）。   |
| **3. 调试和维护困难**  | 父组件无法知道子组件内部有哪些 mixin 注入的属性，排查 bug 和调试困难。   |
| **4. 不利于 Tree-shaking**  | 打包时难以移除未使用的 mixin 代码。   |
| **5. 与 Composition API 理念冲突**   | Mixin 是“横切关注点”，而 Composition API 强调显式、可组合的逻辑。  |

Vue 3 推荐替代方案：Composition API + 可复用函数（Composables）。

| 特性 | Mixin | Composables |
|---------|---------|---------|
| 数据来源明确   | 隐式   | 显式（import）   |
| 是否有命名冲突问题   | 有   | 无  |
| 逻辑封装  | 全局污染   | 按需引入   |
| Tree-shaking 支持  | 差   | 好   |
| TypeScript 支持   | 差   | 好   |

对于全局混入（Global Mixin），Vue3 虽然提供了 `app.mixin()`，但不推荐，推荐使用:
1. `app.config.globalProperties`。
2. `app.provide` 在顶层提供数据，组件通过 `inject` 方法消费数据。

## 10、介绍下 Vue.js 中的函数式组件、异步组件和递归组件
### 10.1 函数式组件（Functional Components）

函数式组件是一种轻量级、无状态的组件形式。它们很像纯函数：接收 props，返回 虚拟 DOM（vnode）。函数式组件在渲染过程中不会创建组件实例 (也就是说，没有 this)，也不会触发常规的组件生命周期钩子。没有响应式系统、生命周期和实例的开销，函数式组件自然在渲染上更加高效和快速。

总而言之，函数式组件有**无状态**、**无this**、**无生命周期**、**性能更高**等特点。

使用场景：适合简单、静态的 UI 元素，如列表项或包装组件。

在 Vue 2 中，通过 `functional: true` 声明；在 Vue 3 中，函数式组件更简单，直接返回渲染函数。

**Vue2 示例**:
```vue
<template functional>
  <div>{{ props.msg }}</div>
</template>
```

或者 js 形式：
```js
export default {
  functional: true,
  props: ['msg'],
  render(h, { props }) {
    return h('div', props.msg);
  }
};
```

**Vue3 示例**:
```vue
<script setup>
import { h } from 'vue';

const FunctionalComp = (props) => h('div', props.msg);
</script>

<template>
  <FunctionalComp msg="Hello Functional" />
</template>
```
### 10.2 异步组件（Async Components）
异步组件是一种懒加载（Lazy Loading）机制，用于按需加载组件代码，优化初始加载时间和性能。Vue 会动态导入组件，只有在使用时才下载和渲染，常用于路由或大型组件。

**特点：**
- 通过 `import()` 动态加载，返回 Promise。
- 支持加载中（loading）、错误（error）和超时（timeout）处理。
- 在 Vue 3 中，使用 `defineAsyncComponent` 更规范，支持与 `<Suspense>` 结合（Vue 3 独有，用于统一处理异步）。

**Vue2 示例**:
```vue
<script>
export default {
  components: {
    AsyncComp: () => import('./AsyncComp.vue')
  }
};
</script>

<template>
  <AsyncComp />
</template>
```


**Vue3 示例**:
```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComp = defineAsyncComponent(() => import('./AsyncComp.vue'));
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncComp />
    </template>
    <template #fallback>加载中...</template>
  </Suspense>
</template>
```

### 10.3 递归组件（Recursive Components）

递归组件是指组件内部调用自身，用于处理树形或嵌套数据结构，如菜单、树视图或评论回复。Vue 支持组件自引用，但需注意避免无限循环（通过条件终止递归）。

**特点：**
- 组件需有名称（`name` 选项），才能自引用。
- 常结合 `v-for` 和 props 传递数据。

**Vue 2 示例：**
```vue
<template>
  <ul>
    <li v-for="item in tree" :key="item.id">
      {{ item.name }}
      <Tree v-if="item.children" :tree="item.children" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Tree',  // 必须有 name
  props: ['tree']
};
</script>
```

**Vue 3 示例：**
```vue
<script setup>
import { defineAsyncComponent } from 'vue';  // 可选：异步加载避免循环

const Tree = defineAsyncComponent(() => import('./Tree.vue'));  // 自引用
defineProps(['tree']);
</script>

<template>
  <ul>
    <li v-for="item in tree" :key="item.id">
      {{ item.name }}
      <Tree v-if="item.children" :tree="item.children" />
    </li>
  </ul>
</template>
```

## 11、Vue.js 中的 vue-loader 是什么？
Vue-loader 是一个专为 Vue.js 设计的 `Webpack loader`（加载器），其主要作用是将 Vue 的单文件组件（Single-File Components，简称 SFC，即 .vue 文件）转换为可执行的 JavaScript 模块。 它允许开发者以一种结构化的方式编写组件，将模板（template）、脚本（script）和样式（style）封装在同一个文件中，便于管理和维护。

**核心功能**:
- **解析 SFC 文件**：Vue-loader 会自动处理 `.vue` 文件中的三个部分：
  - **template 部分**：编译为 Vue 的渲染函数（render function）。
  - **script 部分**：提取为组件的 JavaScript 逻辑，支持 ES 模块和 TypeScript。
  - **style部分**：处理 CSS，支持预处理器（如 Sass、Less）并可选地应用 scoped（作用域样式）或 CSS Modules。
- **热重载（Hot Module Replacement，HMR）**：在开发模式下，支持组件的热更新，无需刷新页面即可看到变化，提高开发效率。
- **自定义块（Custom Blocks）**：支持扩展，如添加 `<docs>` 或其他自定义标签，用于文档生成或其他工具集成。
- **预处理器支持**：无缝集成 Babel、PostCSS 等工具链。

## 12、Vue.extend 方法的作用？

`Vue.extend`方法可以作为基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

**Vue2 示例：**
```js
var dialog = Vue.extend({
  template: "<div>{{hello}} {{world}}</div>",
  data: function () {
    return {
      hello: "hello",
      world: "world",
    };
  },
});
// 创建 dialog 实例，并手动挂载到一个元素上。
new dialog().$mount("#app");
```
> 注意：在 `Vue.extend` 中的 `data` 必须是一个函数，要不然会报错。

**Vue3 示例：**

Vue3 中不在使用 Vue.extend 方法，而是采用render方法进行手动渲染。

```vue
<!-- Modal.vue -->
<template>
  <div class="modal">这是一个弹窗</div>
</template>

<script>
export default {
  name: 'Modal',
}
</script>
```

```vue
<template>
  <div id="box"></div>
</template>

<script setup>
import { h, render, createApp, onMounted } from 'vue'
import Modal from './Modal.vue'

onMounted(() => {
  render(h(Modal), document.getElementById('box'));
})
</script>
```
## 13、keep-alive 的原理
`<keep-alive>` 是 Vue.js 的内置组件，它的功能是在多个组件间动态切换时缓存被移除的组件实例，避免重复渲染和状态丢失，提高性能。它是一个抽象组件（abstract: true），不会渲染到 DOM，也不会出现在组件树中，而是通过插槽（slots）和自定义 render 函数实现缓存逻辑。

**核心实现机制：**
1. **抽象组件与 Render 函数：**
- `<keep-alive>` 通过 render 函数处理包裹的内容（通常是动态组件，如 `<component>` 或 v-if 切换的组件）。
- 在 render 中，它从插槽获取子组件的 VNode（虚拟节点）。如果子组件有 key（推荐使用），则用 key 作为缓存标识；否则用组件的 tag 或 cid（组件 ID）。
- 如果组件已缓存，直接返回缓存的 VNode（设置 vnode.componentInstance.keepAlive = true 以标记缓存状态）；否则，渲染新实例并存入缓存。

2. **缓存存储：**
- 内部使用一个对象（this.cache）作为缓存 Map，以 key 为键，值为 VNode 对象（包含组件实例）。
- 当组件首次渲染时，存入缓存；切换回时，从缓存取出，避免重新创建实例和执行 mounted 钩子。

3. **LRU 缓存算法：**
- 支持 max 属性设置最大缓存数量（Vue 2.5+）。
- 使用 Least Recently Used（最近最少使用）算法：当缓存超出 max 时，删除最久未访问的组件（通过 this.keys 数组跟踪访问顺序）。
- 访问组件时，将其 key 移到数组末尾（最近使用）；超出时，删除数组开头的 key，并销毁对应实例（调用 $destroy）。

4. **过滤规则（include/exclude）：**
- 通过 include（白名单）和 exclude（黑名单）属性决定哪些组件缓存，支持字符串、正则、数组或函数。
- 在 created 钩子中，监听这些 prop 的变化，并调用 pruneCache 更新缓存（移除不匹配的组件）。

5. **生命周期钩子：**
- 缓存组件不会触发 destroyed/unmounted，而是使用 activated（激活时）和 deactivated（失活时）钩子。
- 这允许开发者在切换时管理状态（如暂停定时器），而非完全销毁。


>**注意事项：**
>- 只缓存一个直接子组件（插槽内容），不支持多个。
>- Vue 3 中原理类似，但优化了 VNode 处理和 Composition API 支持。
>- 潜在问题：缓存过多导致内存占用；需手动清理资源（如在 deactivated 中停止监听）。

## 14、Vue.js 中使用了哪些设计模式?

### 1. 观察者模式 (Observer Pattern)
- 描述：Vue 的响应式系统使用观察者模式，通过 Proxy (Vue 3) 或 Object.defineProperty (Vue 2) 拦截对象属性的 get/set 操作。当数据变化时，通知订阅者（Watcher）更新视图。
- 应用：在 reactive() 函数中，返回 Proxy 对象，get 陷阱用于依赖收集 (track)，set 陷阱用于触发更新 (trigger)。
- 优势：实现了细粒度的变更检测，避免全局重渲染。

### 2. 发布-订阅模式 (Publish-Subscribe Pattern)
- 描述：Vue 的事件系统和响应式通知机制采用 Pub-Sub 模式。数据变化时发布事件，订阅者（如组件渲染函数）接收并响应。
- 应用：在响应式系统中，trigger() 函数检索订阅者效果并调用它们；事件 API 如 $emit 和 $on 也基于此。
- 优势：解耦了数据生产者和消费者，支持异步更新。

### 3. 代理模式 (Proxy Pattern)
描述：Vue 3 的响应式系统直接使用 ES6 Proxy 作为代理层，拦截对象操作，实现透明的响应式。
应用：reactive() 返回 Proxy 对象，代理目标对象的访问和修改。
优势：比 Vue 2 的 defineProperty 更强大，支持数组和 Map/Set 等类型。

### 4. 策略模式 (Strategy Pattern)
- 描述：Vue 的虚拟 DOM diff 算法使用不同策略（如 key-based diff 或简单 patch）来优化更新。
- 应用：在渲染过程中，根据节点类型选择 diff 策略。
- 优势：最小化 DOM 操作，提高渲染效率。

### 5. 单例模式(Singleton Pattern)
- 描述：整个程序中有且仅有一个实例。
- 应用：vuex 的 store 和插件。
- 优势：全局唯一、节约资源、便于管理。

### 6. 工厂模式(Factory Pattern)
- 描述：提供了一种创建对象的方式，使得创建对象的过程与使用对象的过程分离。
- 应用：Vue2 中的组件创建，传入参数给 `createComponentInstance` 就可以创建实例。
- 优势：解藕，易于维护。

## 15、Vue.js 应用中常见的内存泄漏来源有哪些？

1. 未清理的事件监听器、定时器、动画
```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';

let timer = null;
let controller = null;
let raf = null;

onMounted(() => {
  // 定时器
  timer = setInterval(() => {}, 1000);
  // 动画
  raf = requestAnimationFrame(() => {});
  // 事件监听
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  clearInterval(timer);
  cancelAnimationFrame(this.raf);
  window.removeEventListener('resize', handleResize);
});
</script>
```
2. 未移除的第三方库实例
```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';

let chart = null;

onMounted(() => {
  chart = echarts.init(this.$refs.chart);
});

onUnmounted(() => {
  chart?.dispose();
});
</script>
```
3. 事件总线（Event Bus）未解绑

vue2 用可以用 `new Vue` 全局创建一个事件总线实例，或者在组件中直接使用 `this.$on`、`this.$emit`、`this.$off`。

vue3 则需要借助第三库，比如 mitt 来实现事件总线。


```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import mitt from 'mitt';

// 创建事件总线实例
const emitter = mitt();

onMounted(() => {
  emitter.on('update', this.handler);
});

onUnmounted(() => {
  emitter.off('update', this.handler);
});
</script>
```

顺便提一下， vue3 为啥去掉 `$on、$emit、$off` 这些 API，主要有以下原因：
1. 设计理念的调整

Vue 3 更加注重组件间通信的明确性和可维护性。$on 这类事件 API 本质上是一种 "发布 - 订阅" 模式，容易导致组件间关系模糊（多个组件可能监听同一个事件，难以追踪事件来源和流向）。Vue 3 推荐使用更明确的通信方式，如：
-   父子组件通过 props 和 emit 通信
-   跨组件通信使用 provide/inject 或 Pinia/Vuex 等状态管理库
-   复杂场景可使用专门的事件总线库（如 mitt

2. 与 Composition API 的适配

Vue 3 主推的 Composition API 强调逻辑的封装和复用，而 $on 基于选项式 API 的实例方法，与 Composition API 的函数式思维不太契合。移除后，开发者可以更自然地使用响应式变量或第三方事件库来实现类似功能。

3. 减少潜在问题
- $on 容易导致内存泄漏（忘记解绑事件）
- 事件名称可能冲突（全局事件总线尤其明显）
- 不利于 TypeScript 类型推断，难以实现类型安全

### 4. 未清理的 Watcher

Vue 本身不会泄漏内存，泄漏几乎都来自**开发者未清理的副作用**。养成“创建即清理”的习惯，使用 `beforeDestroy` 或者 `onUnmounted` 集中清理，在使用 `keep-alive` 的组件中，视情况在 `deactivated` 钩子中清理资源。


## 16、Vue.js 中的性能优化手段有哪些？

### 16.1 数据相关
- Vue2 中数据层级不易过深，合理设置响应式数据；
- Vue2 非响应式数据可以通过 Object.freeze()方法冻结属性；
- 合理使用 computed，利用其缓存能力提高性能。

### 16.2 组件相关
- 控制组件粒度（Vue 采用组件级更新）；
- 合适场景可使用函数式组件（函数式组件开销低）；
- 采用异步组件（借助构建工具的分包的能力，减少主包体积）；
- 在组件卸载或者非激活状态及时清除定时器、DOM事件、事件总线、三方库的实例等。
- v-on 按需监听、使用动态 watch 和及时销毁 watch。

### 16.3 渲染相关
- 合理设置 key 属性；
- v-show 和 v-if 的选取；
- 使用防抖、节流、分页、虚拟滚动、时间分片等策略；
- 合理使用 keep-alive 、v-once、v-memo 进行逻辑优化。

<!-- 
## 介绍下 Vue 的组件渲染流程
1. 在渲染父组件时会创建父组件的虚拟节点,其中可能包含子组件的标签
2. 在创建虚拟节点时,获取组件的定义使用 `Vue.extend` 生成组件的构造函数。
3. 将虚拟节点转化成真实节点时，会创建组件的实例并且调用组件的$mount方法。
4. 所以组件的创建过程是先父后子。 -->