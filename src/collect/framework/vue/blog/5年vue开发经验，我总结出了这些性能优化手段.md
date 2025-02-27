------

## 一、v-for优化

### 1.1 使用key

使用`v-for`渲染列表时，可以通过添加合理的`key`来优化性能：

- 不要用`index`作为key
- 不要用`Math.random()`作为key，这个和`index`效果一样
- 一般用唯一的`id`作为`key`

这个是因为vue在重新渲染列表时，会将标签（比如`div span`等）+ `key`前后都相同的节点作为相同节点，会直接进行复用虚拟节点，提升性能。

### 1.2 v-for和v-if不要连用

由于`v-for`的优先级高于`v-if`，所以会在每次迭代时执行 `v-if`的判断，影响性能。

错误写法：

```vue
<template>
  <div>
    <li v-if="list.length > 0" v-for="item in list" :key="item.id">
      {{ item.name }}
    </li>
    <p v-else>列表为空</p>
  </div>
</template>
```

正确写法：

```vue
<template>
  <div>
    <template v-if="list.length > 0">
      <li v-for="item in list" :key="item.id">
        {{ item.name }}
      </li>
    </template>
    <p v-else>列表为空</p>
  </div>
</template>
```



这里再额外提一下，如果列表太长也会影响性能，可以使用`vue-virtual-scroller`等库实现**虚拟列表**来提升性能。

## 二、合理使用v-if和v-show

1. `v-if`：用在组件/DOM上，控制组件/DOM的创建和销毁。
2. `v-show`：用在组件/DOM上，控制**组件根节点**/DOM的CSS`display`属性。正因为如此，**v-show不能用来template空标签上**。

大部分情况下，使用`v-if`可以避免不必要的DOM占用、组件开销，而频繁操作/需要保留状态才会使用`v-show`。

```vue
<!-- 需要频繁显示/隐藏 -->
<div v-show="isVisible">频繁切换的内容</div>

<!-- 偶尔才会显示的内容 -->
<div v-if="isVisible">按需渲染的内容</div>
```

##  三、组件级别的性能优化  

### 3.1 细粒度的组件拆分

vue在重新渲染时两个特点，一个是`异步更新`，一个是`组件级更新/批量更新`，异步更新就是指**修改了响应式数据之后，会通过nextTick进行更新**，组件级更新指的是修改了响应式数据之后，vue的更新是**按组件的粒度来进行更新**，而批量更新指的是，**同一个组件的数据在同一时间改了多次，只会批量更新一次**。

### 3.2 keep-alive缓存

如果页面跳转到其它页面后，希望`back`回到当前页面时**不希望重新加载页面，或者需要保留滚动条状态**，这时候可以使用vue提供的内部缓存组件`keep-alive`缓存组件，提升页面性能和体验。

### 3.3 避免全局组件滥用  

全局组件会始终存在于内存中，减少全局注册，使用局部注册提高内存利用率。  

### 3.4 使用函数式组件functional

函数式组件的特点如下：

- 无状态
- 没有实例，当然也没有`this`上下文

如果一个组件只是接收`props`然后进行渲染，这样就可以将组件标记为`functional`，也就是函数式组件，使用函数式组件的优点是可以**减少组件创建开销**。

```javascript
Vue.component('functional-component', {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```

### 3.5 异步组件/路由懒加载

使用异步组件和路由懒加载可以实现**按需加载**，提升加载速度。

## 四、Object.freeze

vue内部会把data中的数据用`Object.defineProperty`重写`get`和`set`，所以如果是一些不会变化的**静态数据**，可以用`Object.freeze`进行**数据冻结**，这样vue就不会用`Object.defineProperty`去处理这些数据了，同时这些数据变化时，也不会执行更新页面的逻辑了，这样提升了vue的初始化和更新性能。

```javascript
export default {
  data() {
    return {
      obj: Object.freeze({ a: 1, b: { c: 2 }})
    };
  }
};
```

## 五、合理使用computed和Watch

`computed`具有缓存的特点，当依赖没重新变化不会重新计算，提升性能。

`Watch`使用太多会损耗性能，建议少用，比如换成`监听input/change事件回调`，尤其是`deep: true`会深度监听，必要时再使用。

## 六、事件监听的优化

### 6.1 v-on按需监听

我们可以使用`v-on`按需监听组件，比如封装一个`upload`组件时，如果不需要拖拽功能，就不需要监听`dragstart`、`dragover`等事件了。

```vue
<template>
  <div v-on="events" draggable>
    123113
   </div>
</template>
<script>
export default {
  props: {
    // 是否支持拖拽
    isDrag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      events: {},
    }
  },
  created() {
    if (this.isDrag) {
      this.events = {
        dragstart: this.onDragStart,
        dragover: this.onDragOver,
      }
    }
  },
  methods: {
    onDragStart() {
      console.log('onDragStart')
    },
    onDragOver() {
      console.log('onDragOver')
    },
  }
}
</script>
```

### 6.2 @click.stop、@click.capture

合理使用`@click.stop`、`@click.capture`修饰符可以控制时间传播，提升性能。

### 6.3 v-once

使用`v-once`可以将节点标记为**静态节点**， `Vue`在编译阶段会对静态节点进行**静态提升**，同时将静态部分缓存起来，在重新渲染时直接复用 ，提升页面更新性能。

### 6.4 防抖和节流

使用防抖和节流，可以控制事件触发的频率，从而提升页面性能。比如**输入框搜索**场景可以用防抖，**监听滚动事件实现页面懒加载**的时候，可以使用节流。

## 小结

以上就是我结合自己5年的vue使用经验，再加上对vue源码的理解，总结出来的一些vue性能优化手段，当然很多优化都不能显著提升性能，但我还是希望从小处着手，让自己的vue项目写的更加合理，一点一滴的优化慢慢就能累计成大优化。
