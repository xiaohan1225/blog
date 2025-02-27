------

## 前言

还记得几年前我去找前端工作的时候，那时候才初入职场，有一次去面试，然后被面试官问过一个面试题，**Vue中Scoped的原理是什么**？幸好当时八股文面试题背的很多，我当时就说是在选择器加了一个唯一的属性实现的，那时候很慌，就怕他继续追问，在追问就答不上了，因为当时的水平也只有三板斧，就靠硬背，对知识的理解也只停留在表面，现在经过几年的开发经验后，再次回看这个问题，会有不一样的理解。

## CSS常见模块化方案

1. BEM方案：BEM全称是Block Element Modifier，通过` .block__element--modifier `即`.模块名__元素名--修饰符名`这种CSS命名方式实现样式隔离和模块化；
2. CSS Modules：将CSS文件进行编译后，使之具备模块化的能力；
3. CSS-IN-JS：使用 js 来编写CSS规则；



而Vue设置样式的方法则是通过**单文件组件**中的style标签进行样式，你只要在style标签上添加一个`scoped`属性，就能轻松实现样式隔离，而且还可以支持`less`、`sass`等预处理器，甚至还深度集成了`CSS Modules`。当然我们这里主要介绍`是scoped`。

## scoped的使用

```html
<style scoped>
  .container {
      background: red;
  }
</style>
```

在`style`标签上增加`scoped`属性后，最终编译出来的结果会在选择器上增加一个唯一的`attribute`（比如` data-v-mlxsojjm`），每个`.vue`文件编译出来的`attribute`都不一样，从而实现了**样式隔离**。

```html
<style scoped>
  .container[data-v-mlxsojjm] {
      background: red;
  }
</style>
```

## .vue文件的css编译

比如你的.vue文件长这样：

```plain
<template>
  <div class="container"></div>
</template>

<style scoped>
.container {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
```

我们可以用vue提供的解析单文件组件的编译包`@vue/compiler-sfc`，来解析我们在.vue文件中编写的css。

```javascript
const { compileStyle } = require("@vue/compiler-sfc");
const css = `
.container {
    width: 100px;
    height: 100px;
    background-color: red;
}
`;
const { code } = compileStyle({
  source: css, // css源代码
  scoped: true, // 是否要启用scoped
  id: `data-v-${Math.random().toString(36).substring(2, 10)}`, // scoped的id
});
console.log(code);
```

编译结果如下：

```css
.container[data-v-mlxsojjm] {
    width: 100px;
    height: 100px;
    background-color: red;
}
```

可以看到，带了scoped的style标签中的css，编译后会被加上一个**属性选择器**，名字以`data-v`开头，后面跟的是一个字符串，这个其实可以自己定义，只要保证全局唯一就行了，比如可以取当前文件的路径，然后用摘要函数md5或者sha256去生成一个哈希，取这个哈希值就行了。

而template经过编译后，结果如下：

```plain
<template>
  <div class="container" data-v-mlxsojjm></div>
</template>
```

这就是scoped的原理了，**通过给组件中DOM元素和CSS各自都添加一个相同且唯一的属性选择器，让当前的css文件的样式只对当前组件生效**。

## 注意点

### 1. 子组件的根节点会同时被自己以及父组件的样式所影响

在vue官网中有这么一段话：**“使用** `scoped` **后，父组件的样式将不会渗透到子组件中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式”**。

啥意思呢？比如你定义一个父组件`parent.vue`和子组件`child.vue`：

```javascript
// Child.vue
<template>
    <div class="child-container">
      child
    </div>
</template>

<style scoped>
.child-container {
  color: red;
}
</style>

// parent.vue
<template>
  <div class="container">
    <Child />
  </div>
</template>
<script>
import Child from "./Child.vue";
export default {
  name: "Parent",
  components: {
    Child,
  },
}
</script>

<style scoped>
.container {
  width: 100px;
  height: 100px;
  background-color: red;
}
.child-container {
  color: blue !important;
}
</style>
```

最终渲染出来的子组件里面显示的字体颜色是蓝色。

![img](https://cdn.nlark.com/yuque/0/2024/png/21397789/1733929087067-0fc4ab95-0ae2-46ad-bf46-4150032bcdac.png)

怎么会这样呢？看vue最终渲染出来DOM的样子就能看出来了。
![img](https://cdn.nlark.com/yuque/0/2024/png/21397789/1733929143761-8ab38f4b-4f4e-4dd6-85a8-f3dee7e411db.png)

子组件`Child`的根节点上既有自己声明scoped后的属性选择器，又有父级的声明scoped后的属性选择器，所以在父组件中，就可以修改子组件根节点的样式了。

我之前不知道这个知识点的时候，被这个坑了一把，不知道为啥自己组件的样式被改了，当时找了半天才看到是父组件改的，所以我之后定义组件根节点的class名字的时候，尽量定义成一个独一无二的，免得无意中被父组件的同名类名的样式污染了。

### 2. scoped对插槽slot的影响

我们把提供插槽的组件叫`Child`，使用插槽的组件叫`Parent`，slot中的内容最终编译出来会同时含有`Parent`和`Child`的`scopedId`，所以会同时受`Parent`、`Child`两个组件的的样式影响。

```javascript
// Parent.vue
<template>
  <div class="container">
    <Child >
      <div class="c1">c</div>
    </Child>
  </div>
</template>
<script>
import Child from "./Child.vue";
export default {
  name: "Parent",
  components: {
    Child,
  },
}
</script>
<style scoped>
</style>
// Child.vue
<template>
  <div class="child-container">
    child
   <div>
    <slot></slot>
   </div>
  </div>
</template>
<style scoped>
</style>
```

最终渲染的DOM如下：

![img](https://cdn.nlark.com/yuque/0/2024/png/21397789/1733931594152-d2123a4c-b46e-46e4-a5c7-d8cff6b21175.png)

如果遇到相同权重的样式，比如元素`<div class="text">a</div>`，在`Parent`组件中写的样式是`.text{ color: red }`，在`Child`组件中写的样式是`.text{ color: blue }`，由于在vue父子组件的渲染过程中，子组件会先于父组件渲染完成，所以最终父组件样式会覆盖子组件相同权重的样式，最终渲染`color`颜色会是`red`。

## 深度选择器

在实际开发中，我们常常需要在父组件修改子组件的样式，比如在用三方组件库的时候，组件库里的样式往往不能100%满足我们的需求，这时候就要用到**深度选择器**做样式穿透了。

深度选择器有4种语法：

1. 三个大于号 >>>
2. /deep/
3. ::deep{}
4. :deep()

比如你这样写了一段样式：

```plain
.a :deep(.b) {
  color: green;
}
```

上面的代码会被编译成：

```plain
.a[data-v-9ea40744] .b {
    color: green;
}
```

在编译后，在对应css样式上会带上该组件scoped对应的属性选择器，所以自然就能影响子组件的样式了。

## 小结

本文主要介绍了一道前端面试题**Vue中scoped的原理**，主要就是通过生成一个唯一的attribute来实现的，并且带大家通过程序编译了一下带有scoped属性css的`.vue文件`，另外要注意的是子组件的根节点会同时被自己以及父组件的样式所影响，以及scoped在slot中的表现！
