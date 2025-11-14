## 1、Vuex 是什么？什么情况下应该使用 Vuex？
Vuex 是专门为 Vue.js 应用提供状态管理模式的一个库，也是 Vue.js 官方推荐的状态管理方案，它将所有数据集中存储到一个全局 `store` 对象中，并制定了一定的规则，保证状态以预期的方式发生变化。

它的核心概念有：
- **state**：存储状态，并提供响应式能力。
- **getter**: 从 state 中派生出一些状态，相当于 Vue.js 中的计算属性 computed。
- **mutation**: 通过提交 mutation，是 Vuex 中修改 state 的推荐方式。
- **action**：可以包括异步操作，异步操作处理完后，通过提交 mutation 修改状态。
- **module**: 模块化，可以将 store 分割成一个个小模块，每个模块拥有自己的 state、getter、mutation、action，甚至是嵌套子模块。

在构建**中大型单页应用**时，各组件和模块的状态流转逻辑会相当复杂，这时候就可以使用 `Vuex` 进行全局状态管理，并且里面用`严格的 mutation` 保证了状态的预期流转，使得项目的数据流变得清晰，提高了项目可维护性。


## 2、如何解决页面刷新后 Vuex 的数据丢失问题？

**数据丢失原因**：Vuex 中的状态 state 是存储在内存中的，刷新页面会导致内存清空，所以数据丢失。

**解决方案：**
### 2.1 第一步：使用持久化存储保存数据

将 Vuex 的数据在合适时机（比如监听 window 的`beforeunload` 事件）保存到浏览器的本地存储（`localStorage` 或 `sessionStorage`），也可以直接采用 `vuex-persistedstate` 持久化插件（默认会存储到 localStorage 中，可通过配置修改）进行本地存储。

### 2.2 第二步：初始化应用，替换状态
应用初始化加载时，获取存储中的状态进行替换。Vuex 给我们提供了一个 `replaceState(state: Object)`  API，可以很方便进行状态替换。

### 2.3 第三步：检查数据，发起请求
在状态替换后，还需要检查 Vuex 中的数据是否存在，如果不存在则可以在 `action` 中发送接口请求拿到数据，通过提交 `mutation` 修改状态把数据存储到 `store` 中。

### 2.4 第四步：状态同步
状态变化后将状态同步到浏览器存储中，保证本地存储中状态的实时性。

>不过要注意的是，如果把数据持久化到 localStorage 或者 sessionStorage 中，会有一定的安全风险：
>1. 数据直接全部暴露在 storage 可通过控制台的 `Application` 选项卡进行查看，数据容易泄漏。持久化的数据毕竟没有内存中的数据安全。
>2. 用户可以直接在控制台 `Application` 中直接修改数据，从而可能绕过某些权限校验，看到一些预期外的界面和交互。

## 3、mutation 和 action 的区别有哪些？
- **作用不同**：action 是用来处理异步逻辑或者业务逻辑，而 mutation 是用来修改状态的。
- **使用限制**：action 中可以调用 mutation 或者其他 action，而 mutation 中则只能修改 state。
- **返回值不同**：`dispatch` 时会将 action 包装成 promise，而 mutation 则没进行包装。
- **严格模式下的差异**：在 Vuex 开启严格模式 `strict: true` 后，任何非 mutation 函数修改的状态，将会抛出错误。


### 扩展：vuex 严格模式是如何监听非 mutation 函数修改状态的？

**其核心思路如下：**
1. 用`this._committing` 表示程序是否处于 `commit` 执行过程。
2. 用同步 watch（同步监听的意思是，一旦数据发生变化会立即调用回调，而不是在 `下一次 Tick` 中调用） 监听 store 中的 state 状态（深度监听）。
3. 如果在 `commit` 执行过程中，state 发生了变化，在开发环境会报错。

```js
class Store {
  commit(_type, _payload, _options) {
    this._withCommit(() => {
      // commit 中的处理
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
  }
  _withCommit(fn) {
    const committing = this._committing;
    this._committing = true;
    fn(); // 如果函数内部有异步修改状态逻辑，则下面的 watch 时会报错
    this._committing = committing;
  }
}
```

```js
function enableStrictMode(store) {
  watch(
    () => store._state.data,
    () => {
      if (__DEV__) { // 开发环境报错
        assert(
          store._committing,
          `do not mutate vuex store state outside mutation handlers.`
        );
      }
    },
    { deep: true, flush: "sync" } // 定义同步的 watcher 进行同步监控
  );
}
```

## 4、Vuex 的 module 在什么情况下会使用？

用官方的话来说就是，**“使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。”**

所以我们在开发复杂应用时，可以按照业务逻辑将应用状态进行 modules 拆分，比如：
1. 用户模块 user；
2. 订单模块 order；
3. 课程模块 course；
4. ...等其它模块。

这样在开发应用和维护状态时更加精细和清晰，可维护性更强。

## 5、Vuex 和 Pinia 的区别？

`Pinia` 是以 `Vuex 5` 为原型，由 Vue.js 官方团队开发的新一代 Vue 官方推荐的状态管理方案。

**它对比 Vuex 有以下区别：**

### 5.1 API 设计和使用方式
- **Vuex**：采用单一 store 结构，需要严格区分 mutation（同步修改状态）和 action（异步操作）。状态修改必须通过 commit mutations 进行，虽然让数据流向更清晰，但也会让代码更加冗长。
- **Pinia**：更简单的 API 设计，所见即所得，也提供了符合组合式 API 风格的 API（比如用 defineStore 定义 store）。去掉了 mutation，直接在 actions 中修改 state（支持同步/异步）。

### 5.2 模块化和结构
- **Vuex**：支持模块化（modules），但需要在单一 store 中组织，可能导致大型项目 store 膨胀。
- **Pinia**：天生模块化，每个 store 独立定义和导入，支持动态注册和热重载。更适合大型应用，便于拆分成小 store。

### 5.3 TypeScript 支持
- **Vuex**：TypeScript 支持一般，需要额外配置；
- **Pinia**：本身源码就是用 TypeScript 编写，所以对TypeScript 支持十分友好，具备自动推断类型、类型安全和代码补全。

### 5.4 性能和集成
- **Vuex**：Vuex4 在 Vue3 中可用，但与 Composition API 集成不够顺畅，可能需要额外的适配；
- **Pinia**：更轻量（体积小，约1kb），性能更好；完美支持 Vue 3 的 Composition API 和 reactivity 系统。


## 6、Pinia 和 Vuex 如何选择？
- **新项目**：强烈推荐用 `Vue3 + Pinia`；
- **老 Vue2 项目**：如果不把项目升级到 Vue3 还是建议用 Vuex，如果需要升级到 vue3，就可以逐步把 Vuex 替换为 Pinia，Vuex 和 Pinia 是可以同时安装在同一个项目中，这也为项目升级提供了一定的便利。当然，由 `Vuex -> Pinia`，是一次，无疑和 `Vue2 -> Vue3` 一样，是一次大的破坏性升级，工作量还是相当大的。


