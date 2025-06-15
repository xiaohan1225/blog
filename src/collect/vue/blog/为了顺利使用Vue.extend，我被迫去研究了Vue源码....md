## 前言

大家好，我是小寒！

事情是这样的，我们在开发PC端项目的时候，封装了一个`Dialog`组件，我希望这个组件能像`Element UI`里面的`Message`组件一样，通过`this.$message.success()`这样的类似API方式去调用，这时候就需要`Vue.extend`出场了。

## Vue.extend介绍

先来看一下Vue官方文档对它的描述：

**使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。**

组件选项指的是我们平时书写`.vue`文件的`script`标签中`export default`的那个对象，把这个对象传入`Vue.extend`后会返回一个子类的构造器。

## Vue.extend使用

它的使用分为3步：

- 调用`Vue.extend`创建一个组件的构造器`Ctor`
- 通过`new Ctor`创建一个组件实例`instance`
- 调用`instance.$mount()`方法进行挂载

```javascript
// HelloWorld.vue
<template>
    <div>{{ msg }}</div>
</template>

<script>
export default {
    data() {
      return {
        msg: 'hello world'
      }
    }
}
</script>
```

使用`Vue.extend`手动挂载`HelloWorld`组件。

```javascript
<template>
  <div id="app">
    app <br/>
    <button @click="mountComponent">点击挂载组件</button>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import Vue from "vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  methods: {
    mountComponent() {
      const Ctor = Vue.extend(HelloWorld);
      const instance = new Ctor();
      // 挂载方式1：直接调用$mount方法挂载，但目标节点会被清空
      instance.$mount('#app');
      // 挂载方式2：先调用$mount进行空挂载，然后使用DOM API直接将组件DOM插入到页面上
      // instance.$mount();
      // document.body.appendChild(instance.$el);
    }
  },
}
</script>
```

代码中展现了两种挂载方式，方式1是直接挂载到某个目标DOM上，值得注意的是，这个目标DOM里面**原来如果有内容，会被清空**，而方式2则不会，纯粹就是一个DOM操作，很好理解。

## 挂载Dialog组件

那接下来我就通过`vue.extend`去挂载`Dialog`组件，我是这么写的：

```javascript
const DialogCtor = Vue.extend(Dialog);
const dialogInstance = new DialogCtor();
dialogInstance.$mount();
document.body.appendChild(instance.$el);
```

接下来就遇到问题了，因为执行完这段代码后，界面毫无反应。下面是`Dialog.vue`的代码，我这里简化了业务代码只放了一个`demo`。

```javascript
// Dialog.vue
<template>
   <el-dialog
    title="提示"
    :visible.sync="visible"
    width="30%">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: () => ({})
        },
        // ...
    },
    methods: {
        onConfirm() {
            this.$emit('update:visible', false);
        },
        onClose() {
            this.$emit('update:visible', false);
        }
        // ...
    }
}
</script>
```

## 为何界面没渲染出Dialog？

原因显而易见，`Dialog`组件的显示隐藏是由`props`中的`visible`来控制的，我挂载的时候根本就没传入`props`，所以界面就没渲染出来。

既然如此，那我们在创建的时候传入一个`visible`属性不就好了，我们来试一下。



```javascript
const DialogCtor = Vue.extend(Dialog);
const dialogInstance = new DialogCtor({
  props: {
    // 这里创建实施的时候传入 visible 的值
    visible: true,
  }
});
dialogInstance.$mount();
document.body.appendChild(instance.$el);
```

然后发现，还是一点效果没有。

在仔细思考了一下，这里其实要解决的有两个问题：

1. 如何传递props？
2. 如何监听`Dialog`组件内部`emit`出来的事件？

为了解决这两个问题，我特意去找了`Vue官方文档`，发现并没有提及props，网上找了一圈也没有找到解决方案，既然如此，求人不如求己，那我自己去`Vue源码`中找找线索吧。

## 问题1：如何传递props？

![img](https://cdn.nlark.com/yuque/0/2024/png/21397789/1733754782967-125b08b4-09bd-4b00-b124-23071afbc72b.png)

 

我看了一下`Vue.extend`、以及组件的初始化流程相关源码，发现从`Vue.extend`这个流程去创建组件时，在初始化`props`时，会直接到`$options.propsData`中取数据。还记得我们创建组件`instance`的时候，传入了一个对象，`new DialogCtor(obj)`，这个`obj`就是`$options`的一部分。

所以我们传递属性的时候，不应该传`props`，而应该传`propsData`。

## 问题2：如何监听Dialog组件内部emit出来的事件？

接着来看初始化事件的源码部分。

![img](https://cdn.nlark.com/yuque/0/2024/png/21397789/1733755564065-a1ddebc6-c9ac-4d9b-b11c-4591b0347bac.png)

这里取了`$options._parentListeners`的值去初始化事件，所以同样我们需要通过`_parentListeners`来传递事件。

## 改造代码

```javascript
const DialogCtor = Vue.extend(Dialog);
const dialogInstance = new DialogCtor({
  // 通过propsData传递值
  propsData: {
    visible: true,
  },
  _parentListeners: {
  'update:visible'(val)  {
    // 修改visible的值
    dialogInstance._props.visible = val;
  }
});
dialogInstance.$mount();
document.body.appendChild(instance.$el);
```



这里我在`update:visible`的监听回调中，修改的是`dialogInstance._props`中的`visible`的值，其实你直接修改`dialogInstance.visible = val`也是没问题的，最终也是修改的`dialogInstance._props`的值。

监听事件这里，后面我还发现还有另一种写法，直接用`$on`监听即可，代码如下：

```javascript
const DialogCtor = Vue.extend(Dialog);
const dialogInstance = new DialogCtor({
  // 通过propsData传递props
  propsData: {
    visible: true,
  },
});
// 用 $on 监听事件
dialogInstance.$on('update:visible', (val) => {
  dialogInstance.visible = val;
})
dialogInstance.$mount();
document.body.appendChild(dialogInstance.$el);
```

这样就能在**不修改Dialog里面业务代码的情况下，使用Vue.extend成功实现组件**了。

## 小结

上面介绍了`Vue.extend`在业务中的一个使用，在遇到问题的时候查阅了`vue源码`，从源码中找到一些思路并成功解决了问题，也是对`Vue.extend`有了一些深入理解，希望我的经验能帮助到大家！

大家在平时开发中有用过`Vue.extend`吗？欢迎留言讨论！一起学习~
