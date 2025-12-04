## 前言

最近看了一篇谈及`vue高级技巧的`文章，给我看笑了，里面说什么`自定义指令`、`动态组件`、`自定义过滤器` 等等都写在里面了，但凡在实际工作中写过几个中小型的项目，这些都是常用大家都熟知的烂大街的东西好吧，什么叫做真正的vue高级用法，今天来给大家盘点一下。



## 动态Watch

在`vue`中，watch可以监听数据的变化后重新执行函数，平常一般是这样定义Watch的。

```js
export default {
    data() {
        return {
          a: 1,
        }
    },
    watch: {
        'a'(newVal, oldVal) {
          console.log('watch重新执行', oldVal, newVal);
        }
    }
}
```

上面监听了a的值，在变化时会执行Watch，这个叫做`静态Watch`，不过vue其实是支持`动态watch`的，使用`this.$watch` API 可以实现对一个值的动态监听，用法如下：

```js
export default {
    data() {
        return {
          a: 1,
          unwatch: null,
        }
    },
    mounted() {
        this.unwatch = this.$watch('a', (newVal, oldVal) => {
          console.log('watch执行', oldVal, newVal);
        }, {
          immediate: true,
        })
    }
    beforeDestroy() {
        if (this.unwatch) {
            // 主动销毁watch
            this.unwatch();
            this.unwatch = null;
        }
    }
}
```



这里在组件中使用`$watch`对a进行监听，第一个参数可以传一个`Function`或者`String`，第二个参数是函数，第三个参数是`WatchOptions`，里面包括`immediate`、`deep`这些，然后返回一个销毁此watch的函数`unwatch`。

这里要注意，对于静态watch来说，vue会组件初始化时会帮你初始化watch，在组件销毁时帮你销毁掉watch。

而对于动态watch则需要自己主动调用`unwatch`销毁，否则组件被销毁后会一直存在内存中，造成内存泄漏，而且下次初始化这个组件时，又会创建一个新的watch，这样就会造成watch越来越多，内存泄漏越来越严重。

那么，动态watch有什么**应用场景**呢？

假设你现在有一个价格price，在这个价格变化后需要执行一段逻辑。而这个价格是通过后端接口拿到数据后初始化的，而没初始化之前，我是不需要执行这段逻辑的，这时候如果用`静态watch`，肯定会**让watch执行一次**，如果在watch执行中有一些**副作用**，那就还要多加一些逻辑判断，而且这次执行是毫无意义的，应当避免它执行，这时候用`动态watch`就再合适不过。

```js
export default {
     return {
       a: 1,
       unwatch: null,
    }
    async mounted() {
        this.a = await fetch('./xxx');
        this.unwatch = this.$watch('a', (newVal, oldVal) => {
          console.log('watch执行', oldVal, newVal);
        }, {
          immediate: true,
        })
    },
    beforeDestroy() {
        if (this.unwatch) {
            // 主动销毁watch
            this.unwatch();
            this.unwatch = null;
        }
    }
}
```

## @hook

在vue中可以通过`@hook`监听vue的生命周期钩子，来举个例子：

```js
// 父组件 Home.vue
<template>
	<div>
       <Common @hook:mounted="commonMounted" />
    </div>
</template>

<script>
export default {
    methods: {
        commonMounted() {
            console.log('listen common mounted');
        }
    }
}
</script>

// 子组件 Common.vue

<script>
export default {
    mounted() {
      console.log('common mounted');
    }
}
</script>

打印结果如下：

common mounted
listen common mounted
```

这里在父组件`Home.vue`中用`@hook:mounted`给子组件增加监听，然后在子组件`Common.vue`的`mounted`钩子调用完后，会调用`@hook:mounted`的监听函数`commonMounted`，这时候你就可以通过 `$ref.childCompoent.$el` 拿到子组件的操作了。

不仅如此，@hook还可以实现动态监听，实现`程序化的监听器`。

就拿我们上面讲的$watch动态监听来说，有没有发现我们销毁watch的流程存在一点问题？

1. 问题一：需要把创建出来的@watch保存在组件的一个变量`unwatch`上，最好只有生命周期钩子可以访问到它。
2. 问题二：创建watch的代码独立于销毁watch的代码，维护性差，比如我们需要删除这个watch，还需要把`unwatch`，以及`beforeDestory`里面的代码一起删除，最好创建和销毁的代码能放在一起。

```js
export default {
     return {
       a: 1,
       unwatch: null,
    }
    mounted() {
        this.unwatch = this.$watch('a', (newVal, oldVal) => {
          console.log('watch执行', oldVal, newVal);
        }, {
          immediate: true,
        })
    },
    beforeDestroy() {
        if (this.unwatch) {
            // 主动销毁watch
            this.unwatch();
            this.unwatch = null;
        }
    }
}
```

@hook就能轻松解决这两个问题，来看如下代码：

```js
export default {
    mounted() {
        const unwatch = this.$watch('a', (newVal, oldVal) => {
          console.log('watch执行', oldVal, newVal);
        }, {
          immediate: true,
        })
        // 这里使用 $once，当回调执行后便释放监听
        this.$once('hook:beforeDestroy', function () {
          unwatch();
        })
    },
}
```

直接用程序监听当前组件的`beforeDestory`钩子，既省去了`unwatch`变量，又讲创建和清理的代码聚合在一起，方便维护。

## Vue.mixin 全局混入

在平时项目开发中，为了提取一些公共逻辑，会使用到`mixin`进行混入，它可以将一些定义的`method`、`data`、`computed`、`生命周期钩子created、mounted等`注入到组件中。

```js
// mixin.js
export default {
    data() {
        return {
            name: 'zs'
        }
    },
    computed: {
        finalName() {
            return 'final ' + this.name;
        }
    },
    created() {
        console.log('mixin created');
    },
    methods: {
        getName() {
            return this.name;
        }
    }
}
// App.vue
import mixin from './mixin';
export default {
  mixins: [mixin],
  created() {
    console.log(this.finalName);
    console.log(this.getName());
  },
}

/**
输出结果：
mixin created
final zs
zs
*/
```

这是组件级别的混入，但其实Vue还提供了`全局混入`的能力，也就是`Vue.mixin` API。它可以向在`Vue注册的所有实例`注入自己自定义的行为，我们知道**每个vue组件就是一个vue的实例**，也就是说它会向每个vue组件都进行混入。

```js
// main.js
Vue.mixin({
  beforeCreate() {
    console.log("beforeCreate");
    this.owner = 'vue';
  }
})
```

这样会向每个组件都注入一个ower属性，并且其值为`vue`。我们在每个组件中都可以使用这个值了。

```js
<template>
	<div>
    {{ owner }}
  </div>
</template>

<script>
// APP.vue
export default {
	beforeCreate() {
    // 如果定义了同名的钩子，Vue.mixin的钩子会先于组件的执行
    console.log('app beforeCreate');
  },
  created() {;
    console.log(this.owner)
  },
}
  
/**
打印结果：

beforeCreate
app beforeCreate
vue

*/
</script>
```



这个功能在写vue插件的时候非常好用，比如`vuex`用它向每个组件注入了`$store`属性，`vue-router`用它向每个组件注入了`$router`和`$route`实现，我们在写自定义一个vue插件，也可以使用这个方法进行注入。



## Vue.util.defineReactive

vue提供了一个工具函数`defineReactive`,可以把一个数据变成响应式的，也就是数据变化了会刷新页面。

```js
<template>
	<div>
    {{ owner }}
  </div>
</template>

<script>
import Vue from "vue";
// APP.vue
export default {
  created() {
    Vue.util.defineReactive(this, 'owner', 'vue');
    setTimeout(() => {
      this.owner = 'vue1';
    }, 1000)
  },
}
</script>
```

页面会先渲染`vue`，1秒后变成`vue1`，你可能会问，这不就跟`this.$set`一样么？

在这个例子中，由于是给组件实例`this`定义一个新属性，所以跟`this.$set`效果一样，但它是可以给任意对象定义的。

```js
// util.js
import Vue from 'vue';

export const obj = {
    nickname: 'zs',
}

// defineReactive重新定义一下
Vue.util.defineReactive(obj, 'nickname', 'zs');

// 1秒后更新 obj.nickname
setTimeout(() => {
    obj.nickname = 'ls';
}, 1000)

```

```js
<template>
	<div>
    {{ nickname }}
  </div>
</template>

<script>
// APP.vue
import Vue from "vue";
import { obj } from './util'

export default {
  computed: {
    nickname() {
      return obj.nickname;
    }
  },
}
</script>
```

页面上会先渲染`zs`，1秒后更新成`ls`。这样我们可以就把响应式数据从组件中抽离出去了。

不过这个`API`不是vue暴露给用户使用的，官方文档上也没有它的说明，要`谨慎使用`。

## 简单实战：实现全局主题样式控制

我们可以将`defineReactive`和`Vue.mixin`配合使用，实现**响应式的全局混入**。

先在`main.js`中给每个组件混入`beforeCreate`，并使用`defineReactive`给每个组件定义响应式的`$theme`属性。

```js
// main.js
Vue.mixin({
  beforeCreate() {
   Vue.util.defineReactive(this, "$theme", 'light');
  }
})
```

```js
<template>
	<div :class="$theme">
    {{ $theme }}
  </div>
</template>

<script>
// APP.vue
export default {
  created() {
    setTimeout(() => {
      this.$theme = 'dark';
    }, 1000)
  },
}
</script>
<style>
  .light {
    // ...
  }
  .dark {
    // ...
  }
</style>
```

这样就可以通过`$theme`不仅实现全局的`主题样式切换`，而且可以拿`$theme`这个值去在`computed`和`watch`中使用，实现动态控制，非常灵活。

当然，这只是简单实现主题切换，实际项目用的方案会更加完善和复杂。

## 小结

上面介绍了`vue`的一些高级用法：`动态watch`、`@hook`、`Vue.mixin`、`defineReactive`，并用`Vue.mixin`和`defineReactive`简单实现了一个`主题样式切换`的功能，希望能帮助到大家。学会这些高级用法，晋升`vue高级打工人`，哈哈。

对于这些用法，大家在实际开发中有使用过么？

