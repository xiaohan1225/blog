## 一、说说你对vue的理解？
`vue` 是一个用于创建用户界面的开源 `JavaScript` 框架，它的特点如下：

### 1.1 声明式框架
- 早在JQ的时代编写的代码都是命令式的，命令式框架重要特点就是关注过程。
- 声明式框架更加关注结果。命令式的代码封装到了框架内部，过程靠框架来实现。

### 1.2 数据驱动/响应式数据
通过 `Object.defineProperty（Vue 2）` 或 `Proxy（Vue 3）` 实现数据劫持，数据变化时自动更新视图，开发者无需手动操作 DOM。

### 1.3 虚拟DOM
通过高效的 `Diff` 算法比对虚拟 `DOM` 的变化，最小化真实 `DOM` 操作，提升性能。
### 1.4 组件化
将 UI 拆分为独立可复用的组件，每个组件包含自己的模板、逻辑和样式，通过组合组件构建复杂应用。

### 1.5 指令系统
提供 `v-if`、`v-for`、`v-bind`、`v-on` 等指令，以声明式方式增强 HTML 的功能。

### 1.6 渐进式框架
- 渐进集成：可以从小规模功能（如静态页面交互）逐步扩展到完整的单页应用（SPA）。
- 灵活生态：核心库只关注视图层，但配合官方路由（Vue Router）、状态管理（Vuex/Pinia）、构建工具（Vite）等，能轻松扩展为全功能框架。

就是你可以单独用 `vue` 的响应式构建静态页面，如果你需要状态管理，就用官方的状态管理工具 `Vuex/Pinia`，如果你需要构建一个应用，有多个页面，可以上官方路由 `Vue-router`，如果你需要一键生成项目，可以用官方的 `vue-cli` 或者使用`vite`的`npm create vue@latest`命令一键创建项目。

## 二、请说一下响应式数据的理解？

`vue` 是通过数据驱动视图的，响应式指的是当数据发生变化时，使用到该数据的页面会自动更新。在表单中，可以通过响应式实现**双向绑定**，实现表单值和数据的**双向同步**。

### 2.1 基本原理
1. **数据劫持**：`vue2` 中使用 `Object.defineProperty` 对对象属性进行劫持，对数组则采用重写数组的七个方法`（push,shift,pop,splice,unshift,sort,reverse）`来实现劫持，而 `vue3` 则通过 `Proxy` API 可以天然对对象和数组实现数据劫持。
2. **依赖收集**：在getter中收集依赖(谁在使用这个数据)。
3. **派发更新**：在setter中通知所有依赖进行更新。

### 2.2 特点
1. 自动更新：数据变化时，依赖该数据的视图会自动更新。
2. 深度监听：嵌套对象也会被递归转为响应式。
3. 异步更新：Vue会异步执行DOM更新，提高性能。


### 2.3 vue3 响应式改进

使用 `Proxy` 代替 `Object.defineProperty`：
- 可以检测到对象属性的添加和删除。
- 对数组的变化无需特殊处理，天然可以监听到通过数组索引修改元素和修改 `length` 属性的行为。
- 性能更好。


### 2.4 针对响应式可以做的性能优化（vue2）：
- 对象层级过深，性能就会差，所以响应式尽量扁平化。
- 不需要响应数据的内容不要放到 data 中。
- 不需要更新的静态数据可以用 `Object.freeze()` 冻结数据。

### 2.5 注意事项
1. 对象新增属性：`vue 2` 中需要使用 `Vue.set` 或 `this.$set` 方法。
2. 数组变化：`vue 2` 中直接通过索引修改或修改 `length` 属性不会触发响应，应使用变异方法(`push/pop/shift`等)或 `Vue.set、this.$set`。
3. 性能考量：响应式系统需要追踪依赖，大型对象可能会有性能开销。

响应式系统让开发者可以专注于数据逻辑，而无需手动处理 DOM 更新，大大提高了开发效率。

## 四、vue3的升级点？

## vue3架构
Vue3源码采用**monorepo**方式进行管理，将模块拆分到packages中，这样做的好处如下：
1. 将多个模块集合到一个仓库，方便维护
2. 方便版本管理和依赖管理，各模块间相互引用也比较方便
3. 各个包可以单独安装使用，不需要导入整个vue

![图片加载失败](../../assets/images/vue/vue3/vue3包构成.png)

## 组合式API - Composition API
vue2中`Options API`（即提供props、methods、data、computed、watch等属性供用户使用）的问题：
1. 复用性比较差，虽然提供mixins和extends，但会出现数据来源不明确和重名问题。
2. 需要使用带有副作用`this`，存在this指向问题，同时对 `tree-shaking` 也不友好。
3. 对于上百行的大型组件来说，当你了解某段逻辑时，你需要不断上下移动阅读，体验很差。

vue3`Composition API`特点：
1. 方便抽离，复用性强，可以把干净的逻辑提取到一个单独函数或者文件中，让开发者专注于逻辑内聚问题。
2. 抛弃this，tree-shaking友好，打包出来体积更小。

## 响应式系统
vue3采用`proxy`替代了`Object.defineProperty`:
1. 提升了性能，不再需要一次性全部递归拦截
2. 能拦截到对象属性的新增和删除
3. 能拦截原生数组的索引、length操作

## diff算法
全量 `diff` 算法中采用**最长递增子序列**减少节点的移动。在非全量 `diff` 算法中只比较动态节点，通过 `PatchFlag` 标记更新动态的部分。

## 渲染优化
在渲染方面，vue3提供了**自定义渲染器**，大大提升了扩展能力。

## 编译优化
- Block和patchFlag：为动态节点打上补丁标志，即patchFlag，同时还提出了block的概念，block本质上是一个虚拟节点，但它会多出一个dynamicChildren数组，会收集它所有的动态子代节点，比对的时候会忽略DOM层级结构的，所以对于带有v-if、v-for等结构化指令的节点也作为block的角色。
- 静态提升：将静态虚拟的节点提升到render函数之外，这样能够减少更新时创建虚拟DOM带来的性能开销和内存占用。
- 预字符串化：在静态提升的基础上，当模板中包含大量连续纯静态的标签节点时，将这样静态节点序列化成字符串，然后通过innerHTML进行设置，这样做能够减少创建虚拟节点产生的性能开销和内存占用。
- 缓存内联事件处理函数：可以避免不必要的更新
- v-once指令：缓存虚拟节点，避免组件更新时重新创建虚拟DOM的性能开销，同时带有v-once指令的节点不会被父级block收集，所以不会参与diff操作，避免无用的diff开销。

## 新增组件
- Teleport：可以将指定内容渲染到特定容器中，而不受DOM层级的限制。

## 对TypeScript支持更加友好
vue2源码采用Flow做类型检测，对TypeScript支持并不友好，而Vue3采用TypeScript进行重写，对TS的支持更加友好。

## 体积更小（移除了不常用的 API）
- 移除 inline-template (Vue2 中就不推荐使用)。
- $on、$off、$once （如果有需要可以采用 mitt 库来实现）。
- 删除过滤器 filter （可以通过计算属性或者方法来实现）。
- $children移除 （可以通过provide，inject方法构建$children）。
- 移除.sync .native 修饰符 (.sync通过 v-model:xxx实现，.native为 Vue3 中的默认行为) 以及不在支持 keycode 作为v-on修饰符（@keyup.13 不在支持）。
- 移除全局 API。Vue.component、Vue.use、Vue.directive (将这些 api 挂载到实例上)。
- 通过构建工具 Tree-shaking 机制实现按需引入，减少用户打包后体积。


## 五、Vue为什么需要虚拟DOM？
虚拟DOM（Virtual DOM）就是用 js 对象来描述真实 DOM，是对真实 DOM 的抽象。

### 4.1 性能优化
- **直接操作 DOM 代价高昂**：浏览器 DOM 操作是非常消耗性能的。
- **最小差异更新**：通过比对新旧虚拟 DOM 节点，找出最小差异进行更新。
- **批量更新**：在数据修改后，异步批量更新。

> 虚拟DOM并不一定能提升性能，比如你就改了一个数据，vue还要走一遍 DOM diff 比对完后再去调用原生 DOM API去更新，这时候其实你直接通过原生DOM API 去更新肯定性能更高，但是虚拟 DOM 能保证性能的下限，在你的应用复杂且庞大的时候，不至于性能太差。

### 4.2 跨平台
- **抽象层作用**：虚拟 DOM 是对真实 DOM 的抽象表示。
- **多端渲染**：同一套虚拟 DOM 可以渲染到不同平台（Web、Native、Canvas等）。
- **服务端渲染(SSR)**：在没有真实 DOM 的环境下也能生成页面结构。

### 4.3 声明式编程的优势
- **开发者友好**：开发者只需关心数据状态，不必手动操作 DOM。
- **自动优化**：框架层面负责最高效的更新策略，开发者无需微观管理。

### 4.4 与响应式系统的协同
- **依赖追踪**：虚拟 DOM 与 Vue 的响应式系统紧密结合。
- **组件级更新**：数据更改后，在组件级别进行页面更新。

## 五、Vue中的diff原理
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

Vue3 的其它优化改进：
1. **静态提升**：将静态节点提升到渲染函数外部，避免重复创建。
2. **Patch Flag**：标记动态绑定的类型，减少比较次数。
3. **缓存事件处理函数**：避免不必要的更新。
4. **Block Tree**：将动态节点组织为区块，减少比较范围。

## 六、v-show和v-if有什么区别？使用场景分别是什么？

**相同点**：控制元素在页面是否显示

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

## 七、Vue中 computed 和 watch 的区别
| 特性 | computed (计算属性) | watch (侦听器) |
|---------|---------|---------|
| 设计目的  | 派生新数据   | 观察数据变化执行副作用   |
| 返回值   | 必须返回一个值   | 不需要返回值   |
| 缓存   | 有缓存，依赖不变时不重新计算	   | 无缓存，每次变化都执行   |
| 异步操作   | 不能包含异步操作   | 可以执行异步操作   |
| 初始执行  | 立即执行  | 默认不立即执行(配置 immediate: true后会立即执行)  |
| 使用场景   | 模板中使用的派生数据   | 数据变化时需要执行的操作(如API调用、复杂逻辑)   |

## Vue.set方法是如何实现的?
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

## Vue2 的生命周期方法有哪些？一般在哪一步发起请求及原因
- **beforeCreate**：在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
- **created**：实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el
- **beforeMount**：在挂载开始之前被调用：相关的 render 函数首次被调用。
- **mounted**：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
- **beforeUpdate**：数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
- **updated**：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
- **beforeDestroy**：实例销毁之前调用。在这一步，实例仍然完全可用。
- **destroyed**：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。

**钩子函数的作用**：

- **created**：实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。(服务端渲染支持created方法)
- **mounted**：实例已经挂载完成，可以进行一些DOM操作
- **beforeUpdate**：可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
- **updated**：可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用。
- **destroyed**：可以执行一些优化操作,清空定时器，解除绑定事件

在哪发送请求都可以，主要看具体你要做什么事，一般会在 `created` 和 `mounted` 发起请求，但注意服务端渲染不执行 `mounted` 钩子。


## Vue组件间传值的方式及之间的区别
**vue2**：

- 一、父子通信
  1. `props`
  2. `$emit`
  3. `$attrs、$listeners`
  4. `$parent、$children`
  5. `$ref`
  6. `作用域插槽`
  7. `v-model`
- 二、兄弟组件通信
  1. `mitt`
  2. `$parent`
  3. `vuex/pinia`
  4. `app.config.globalProperties`
- 三、跨层级通信
  1. `vuex`
  2. `provide/inject`
  3. `event bus`

**vue3**：
- 一、父子通信
  1. `props`
  2. `defineEmits`
  3. `$attrs`
  4. `$ref + defineExpose`
  5. `$parent`
  6. `作用域插槽`
  7. `v-model`
- 二、兄弟组件通信
  1. `mitt`
  2. `$parent`
  3. `vuex/pinia`
  4. `app.config.globalProperties`
- 三、跨层级通信
  1. `mitt`
  2. `vuex/pinia`
  3. `provide/inject`


**其它通信方式**：
- 浏览器本地存储`storage`
- 全局`window`对象
- ES6模块化import/export

## Vue.mixin的使用场景和原理？（Vue2）
Vue.mixin 的作用就是抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则”以组件的数据为准。

mixin 中有很多缺陷 "命名冲突问题"、"依赖问题"、"数据来源问题",注意 mixin 的数据是不会被共享的！

## Vue的组件渲染流程?
1. 在渲染父组件时会创建父组件的虚拟节点,其中可能包含子组件的标签
2. 在创建虚拟节点时,获取组件的定义使用Vue.extend生成组件的构造函数。
3. 将虚拟节点转化成真实节点时，会创建组件的实例并且调用组件的$mount方法。
4. 所以组件的创建过程是先父后子。

## Vue中组件的data为什么是一个函数?

每次使用组件时都会对组件进行实例化操作，并且调用data函数返回一个对象作为组件的数据源。这样可以保证多个组件间数据互不影响。

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

## v-if 和 v-for 哪个优先级更高？


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
