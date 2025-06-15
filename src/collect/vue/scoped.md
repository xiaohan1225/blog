---
theme: channing-cyan
---

## 前言
用过vue进行开发的肯定都知道`vue的scoped`,它是一种vue官方提供的**样式隔离方案**，我们今天一起聊聊它的原理。

## scoped的作用
我们在style标签中，增加一个scoped属性，这样的话，这个style标签写的样式，只会对当前组件生效。

## .vue文件的css编译
比如你的.vue文件长这样：
```
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
```js
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
```
<template>
  <div class="container" data-v-mlxsojjm></div>
</template>
```

这就是scoped的原理了，**通过给组件中DOM元素和CSS各自都添加一个相同且唯一的属性选择器，让当前的css文件的样式只对当前组件生效**。

## 注意点
在vue官网中有这么一段话：**“使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式”**。

啥意思呢？比如你定义一个父组件`parent.vue`和子组件`child.vue`：

```js
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

![image-20240910003031050](E:\code\images\image-20240910003031050.png)

怎么会这样呢？看vue最终渲染出来DOM的样子就能看出来了。

![image-20240910003054692](E:\code\images\image-20240910003054692.png)

子组件`Child`的根节点上既有自己声明scoped后的属性选择器，又有父级的声明scoped后的属性选择器，所以在父组件中，就可以修改子组件根节点的样式了。

我之前不知道这个知识点的时候，被这个坑了一把，不知道为啥自己组件的样式被改了，当时找了半天才看到是父组件改的，所以我之后定义组件根节点的class名字的时候，尽量定义成一个独一无二的，免得无意中被父组件的同名类名的样式污染了。

## 深度选择器
在实际开发中，我们常常需要在父组件修改子组件的样式，比如在用三方组件库的时候，组件库里的样式往往不能100%满足我们的需求，这时候就要用到**深度选择器**了。

深度选择器有4种语法：
1. 三个大于号 >>>
2. /deep/
3. ::deep{}
4. :deep()

比如你这样写了一段样式：
```
.a :deep(.b) {
  color: green;
}
```

上面的代码会被编译成：
```
.a[data-v-9ea40744] .b {
    color: green;
}
```

在编译后，在对应css样式上会带上该组件scoped对应的属性选择器，所以自然就能影响子组件的样式了。