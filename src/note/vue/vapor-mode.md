
## 前言 

`Vapor Mode` 是 `Vue 3.6` 推出的一个新的高效渲染模式，它实现了**无虚拟DOM**并大幅度提升性能。

先了解下 `Vue` 各版本的渲染机制：
- `Vue 1.0`：直接操作真实 DOM。
- `Vue 3.6 之前`：生成虚拟 DOM，更新时通过比对前后虚拟 DOM 的变化，来更新对应的真实 DOM。
- `Vue 3.6`: Vapor Mode 模式，。 

## 1、Vapor Mode 是什么？

`Vapor Mode` 是 Vue.js 3.6 版本的一个可选编译策略，它在模版编译阶段会生成高效的 JavaScript 代码，直接操作真实 DOM 节点，并通过细粒度的响应式效果（reactive effects）来更新它们。

`Vapor Mode` 的**核心思想**就是，在编译阶段就精确的拿到哪些节点时永不变化的静态节点，哪些是动态节点并与哪个数据源相绑定，这样我们就不需要 VNode 和 DOM Diff 的过程了。


## 2、Vapor Mode 相比于虚拟 DOM 的好处有哪些？
- **节省虚拟 DOM 的内存开销**：虚拟 DOM 毕竟是用 JS 对象描述 DOM 并存储在内存中，`Vapor Mode` 可以节省这部分内存。
- **节省 DOM Diff 的运行开销**：虚拟 DOM 在更新时需要进行 `DOM Diff` 比对出最小更新变化，而 `Vapor Mode` 也可以节省这部分比对的运行开销。
- **更小的包大小**：它去除了虚拟 DOM 的运行时代码 `Virtual DOM runtime code`，自然就减少了代码体积。
- **更高的性能**：通过在 effects 中直接对真实 DOM 进行细粒度的更新，性能更高。

## 3、如何使用 Vapor Mode？

### 3.1 创建一个 vue3 + ts 的项目
```bash
pnpm create vite vue3-vapor
```

### 3.2 手动修改 vue 版本
手动将 `package.json` 中的 vue 版本改为最新的 `3.6.0-alpha.5`，然后运行 `pnpm i` 命令安装。
```json
{
  "dependencies": {
    "vue": "3.6.0-alpha.5"
  }
}
```

### 3.3 改造入口文件 main.ts

跟 Vue2 中组件或者指令的注册方式类似，`Vapor Mode` 也有两种引入方式。

**方式一：通过 createVaporApp 全局引入**

直接使用 `createVaporApp` 代替 `createApp` 来创建应用，这样在全局的组件都会采用 `Vapor Mode` 的模式，而且不会引入虚拟 DOM 的运行时代码，整体应用体积会更小。

```ts
// main.ts
import { createVaporApp } from 'vue'
import './style.css'
import App from './App.vue'

createVaporApp(App as any).use(vaporInteropPlugin).mount('#app')
```

**方式二：通过 vaporInteropPlugin 插件注册**

在入口文件 `main.ts` 中引入 `vaporInteropPlugin` 插件，然后可以在组件中按需启用 `Vapor Mode`。

```ts
// main.ts
import { createApp, vaporInteropPlugin } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).use(vaporInteropPlugin).mount('#app')
```

然后我们在组件中通过在 `script` 标签上增加 `vapor` 属性，就会启用 `Vapor Mode`，改变这个组件的编译模式，没有加 `vapor` 属性的组件还是会使用虚拟 DOM。

```vue
<script setup vapor>
// ...
</script>
```

## 4、Vapor Mode 构建产物分析

**导入和辅助函数的区别：**
- 虚拟 DOM 模式：会导入如 `_createElementVNode`、`_createElementBlock`、`_toDisplayString`、`_normalizeClass` 等函数，用于创建和处理 VNode。
- Vapor Mode 模式：会导入如 `_template`、`_renderEffect`、`_setText`、`_setClass`、`_setDynamicProp` 等，用于直接 DOM 创建和更新。

**更新机制：**
- 虚拟 DOM 模式：在状态变化时，通过 `render` 函数生成新的虚拟 DOM，然后 `patch` 真实 DOM。
- Vapor Mode 模式：通过 `_renderEffect` 包裹，每个动态部分（如类、属性、文本）独立跟踪依赖。当响应式值变化时，仅执行对应的 `setter` 函数（如` _setText(node, value)` 或 `_setClass(node, value)`），直接修改 DOM 无需 diff 过程。

下面来比较下两种模式模式编译后代码的区别。
```vue
<script setup>
import { ref } from 'vue';
const msg = ref('Hello World!');
const classes = ref('p');
const count = ref(0);
</script>

<template>
  <h1 :class="classes" @click="count++">{{ msg }}</h1>
</template>
```

**虚拟 DOM 模式编译后的代码如下（简化版）：**
```js
import { toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("h1", {
    class: _normalizeClass(_ctx.classes),
    onClick: _cache[0] || (_cache[0] = () => _ctx.count++)
  }, _toDisplayString(_ctx.msg), 11 /* TEXT, CLASS, NEED_PATCH */));
}
```

会生成 VNode，使用补丁标志（如 11）标记需要更新的部分。

**Vapor Mode 模式编译后的代码如下（简化版）：**
```js
import { renderEffect as _renderEffect, setText as _setText, setClass as _setClass, template as _template } from "vue/vapor";

const t0 = _template("<h1></h1>");

export function render(_ctx) {
  const n0 = t0();  // 直接创建 <h1> DOM 节点
  n0.addEventListener('click', () => _ctx.count++);  // 直接事件绑定

  _renderEffect(() => _setText(n0, _ctx.msg));  // 响应式文本更新
  _renderEffect(() => _setClass(n0, _ctx.classes));  // 响应式类更新

  return n0;
}
```

直接使用 `document.createElement` 创建节点，事件通过 `addEventListener` 绑定，更新通过 `effects` 细粒度执行。


## 5、Vapor Mode 使用建议
- `Vapor Mode` 目前还处于 `alpha` 版本，不建议在生产环境下使用。
- 在对性能敏感的组件，可以选择性启动 `Vapor Mode` 模式提升其性能，这是一种渐进式增强的思想。