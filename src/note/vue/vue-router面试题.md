
## 1、Vue Router 是什么？它解决了什么问题？

`Vue-router` 是 `Vue.js` 的官方路由，是 `Vue.js` 构建单页应用的路由解决方案。每一个页面对应一个路由，它通过路由表，维护每个路由和组件的对应关系，在切换路由时，使得之前的组件失活并且渲染激活新对应的组件，实现单页应用的流畅切换，而无需刷新页面，提高了用户体验和性能。

## 2、什么是单页应用和多页应用？

### 2.1 单页应用（Single Page Application, SPA）

所谓单页应用（Single Page Application, SPA），就是整个应用只有一个 html 页面，即`index.html`，html 加载后通过 javascript 动态创建和渲染内容，用户点击时，通过监听客户端路由变化去局部更新 DOM，而无需刷新页面就能达到页面切换的目的。

- **特点**：**客户端渲染 + 前端路由**。

**优点**：
- 用户体验好。
- 服务端资源占用少。
- 开发效率高（前后端分离开发模式）。

**缺点**：
- 首屏加载慢。
- SEO不友好。
- 内存占用多（可能导致内存泄漏）。

### 2.2 多页应用 (Multi Page Application, MPA)

与 SPA 对应是多页应用 (Multi Page Application, MPA)，每个页面都有独立 html 页面，每次用户导航时会向服务器发起请求拿到对应的 html 页面。

- **特点**：**服务端端渲染 + 服务端路由**。

**优点**：
- SEO 友好。
- 首屏加载快。

**缺点**：
- 页面切换时体验没有 spa 丝滑。
- 服务器资源占用多，成本高。
- 开发复杂（前后端耦合）。

## 3、如何实现动态路由、嵌套路由、路由懒加载、如何处理 404 页面？
### 3.1 动态路由

使用冒号（：）定义参数，比如 `{ path: '/user/:id', component: User }`, 组件内部通过 `$route.params.id` 获取对应参数。

```js
const routes = [
  { path: '/user/:id', component: () => import('./User.vue') }
];
```

但需要注意获取到的 id 是 `string` 类型，如需转成 `Number` 需可以在组件内部调用 `Number(this.$route.params.id)` 进行转换，更方便的方式是在路由中将 id 定义为 props。

```js
const routes = [
  { 
    path: '/user/:id', 
    component: UserComponent,
    props: router => ({
      id: Number(router.params.id),
    }),
  }
];

```

组件内部直接通过 props 接收即可。

### 3.2 嵌套路由

直接通过路由配置中的 `children` 属性定义即可。

```js
const routes = [
  {
    path: '/user',
    component: UserComponent,
    children: [
      { path: 'list', component: UserListComponent },
      { path: ':id', component: UserDetailComponent },
    ]
  }
];
```
这样就定义了`/user/list`、`/user/:id` 两个子路由。

需要注意的是，如果子路由 `path` 以 `/` 开头，则子路由最终的 URL 将不会带上父路由的 `path`。

```js
const routes = [
  {
    path: '/user',
    component: UserComponent,
    children: [
      { path: '/list', component: UserListComponent },
      { path: '/:id', component: UserDetailComponent },
    ]
  }
];
```

这样定义的两个路由是 `/list` 和 `/:id` 。

### 3.3 路由懒加载

直接通过 `import()` 方法引入路由组件即可实现路由懒加载，这样定义路由后，`webpack` 等打包工具在构建时就不会把这个组件打包到主包里面，而是放在一个单独的 `chunk`，用到时在通过 `http` 请求去动态加载。

```js
const routes = [
  { 
    path: '/user/:id', 
    component: () => import('./User.vue'),
  }
];

```

```js
export default {
  props: { id: Number }
}
```

### 3.4 配置404页面

`path` 属性可以支持通配符，在路由配置末尾配置 `{ path: '*', component: NotFoundComponent }` 即可。

## 4、vue-router 有几种钩子函数?具体是什么及执行流程是怎样的?

钩子函数种类有: **全局守卫、路由独享守卫、组件守卫**。
- **全局守卫**：`router.beforeEach`（导航前）、`router.beforeResolve`（解析前）、`router.afterEach`（导航后）
- **路由独享守卫**：在路由配置中定义 `beforeEnter`。
- **组件守卫**：`beforeRouteEnter`（进入组件前，无法访问通过 this 拿到组件实例）、`beforeRouteUpdate`（路由改变，该组件被复用时调用）、`beforeRouteLeave`（离开当前组件）。

这些钩子在实际业务开发中，可以实现**权限验证、数据预加载、进度条显示**等功能。

**钩子的执行顺序如下**：
1. 触发导航。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在被复用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 调用路由配置中的 `beforeEnter` 守卫。
6. 解析异步路由组件（即加载 `import()` 导入的组件）。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 `DOM` 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。


## 5、vue-router 两种模式的区别？
- **hash 模式（vue-router 默认路由模式）**：

使用 URL 的 # 号（如 /home#about），浏览器不会向服务器发送请求，兼容性好，但 URL 不美观。

- **history 模式**：

使用 HTML5 History API（如 /home），URL 更简洁，但需要服务器配置支持（否则刷新页面会 404），因为浏览器会向服务器请求该资源。

## 6、前端路由的实现原理是什么？

### 6.1 hash路由

原理：利用 URL 的 # 号变化页面不刷新的特性，然后通过监听 `hashchange`，拿到 # 号后面的 哈希内容作为路由 `path`，进行从路由表中找到对应的组件进行激活渲染即可。

我这里用 `hash.html` 文件写一个简单的 demo：

```html
<!-- hash.html -->
<ul>
    <li><a href="#/home">首页</a></li> 
    <li><a href="#/about">关于我们页面</a></li>
</ul>

<div id="routeView">
      <!-- 模拟 <router-view> 组件渲染 -->
</div>

<script>
  const routes = [
      {
          path: '#/home',
          component: '首页',
      },
      {
          path: '#/about',
          component: '关于我们页面',
      }
  ]
  const routeViewEl = document.querySelector('#routeView');
  const onHashChange = () => {
    for(let i = 0; i < routes.length; i++) {
        if(routes[i].path === location.hash) {
          routeViewEl.innerHTML = routes[i].component;
          break;
        }
    }
  }
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('DOMContentLoaded', onHashChange); // 首次加载时匹配路由内容
</script>
```

### 6.2 history 路由

**HTML5 History API 提供了以下方法**：
- **pushState()**：将给定的数据、标题（如果提供，则指定 URL）推送到会话历史栈中。
- **replaceState()**：使用指定的数据、标题（如果提供，则指定 URL）更新历史栈中的最新条目。
- **back()**：回到会话历史中的上一页，相当于浏览器的后退按钮。
- **forward()**：转到会话历史中的下一页，相当于浏览器的前进按钮。
- **go()**：跳转到会话历史中的相对页，-1 表示上一页，1 表示下一页，超出边界则无效。

另外在 `window` 对象上提供了 `popstate` 事件，当激活同一文档中不同的历史记录条目时会被触发。所以用 `HTML5 History API` + `popstate` 事件即可实现 `history` 路由。

我这里用 `history.html` 文件写一个简单的 demo：

```html
<!-- history.html -->
<ul>
      <li><a href="/home">首页</a></li> 
      <li><a href="/about">关于我们页面</a></li>
  </ul>

  <div id="routeView">
       <!-- 模拟 <router-view> 组件渲染 -->
  </div>

  <script>
    const routes = [
        {
            path: '/home',
            component: '首页',
        },
        {
            path: '/about',
            component: '关于我们页面',
        }
    ]

    const routeViewEl = document.querySelector('#routeView');
    const onPopState = () => {
      for(let i = 0; i < routes.length; i++) {
         if(routes[i].path === location.pathname) {
           routeViewEl.innerHTML = routes[i].component;
           break;
         }
      }
    }
    window.addEventListener('popState', onPopState)
    window.addEventListener('DOMContentLoaded', () => {
      const links = document.querySelectorAll('a');
      links.forEach((a) => {
          a.addEventListener('click', (e) => {
              e.preventDefault() // 阻止 a 标签跳转
              history.pushState(null, '', a.getAttribute('href')); // 获取 a 标签上的 href 属性作为跳转 URL
              onPopState();
          })
      })

    });
  </script>
```

这里有两个注意点：
1. 需要阻止 a 标签的默认跳转行为，要不然会向服务器发起请求，直接跳走。
2. 预览 `history.html` 需要起一个本地服务器去预览，比如`http://127.0.0.1:5500/history.html`，要不然会报错 `Uncaught SecurityError: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///home' cannot be created in a document with origin 'null' and URL`。这应该是浏览器在 `History API` 所做的一些安全策略。


## 7、vue 项目本地开发完成后部署到服务器后报 404 是什么原因呢？

如果你使用的是 Vue Router 的 history 模式。刷新时会向服务端发起请求，服务端无法响应到对应的资源，所以会出现 404 问题。需要在服务端进行处理将所有请求重定向到你的 Vue 应用的入口文件。

配置后服务端不会再出现 404 问题，Vue 应用中要覆盖所有的路由情况。

`nginx.conf` 配置方式：
```bash
location / {
  try_files $uri $uri/ /index.html;
}
```
 ## 8、使用动态路由时，如何解决参数变化但组件未更新的问题？

 比如路由从 `/user/1` 跳转到 `/user/2`，发现组件中 `created、mounted` 等生命周期钩子没有重新执行，导致没拿到最新的数据渲染到页面上。

### 8.1 方案一：watch 监听 $route

`$route` 是 `vue-router` 注入到组件中的一个响应式数据，当路由发生变化时，其数据会发生变化。

```js
export default {
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
         this.users = await axios.get(`/api/user/${this.$route.params.id}`); // 获取最新数据
      }
    }
  }
}
```

### 8.2 方案二：使用组件内的路由导航守卫 beforeRouteUpdate

在当前路由改变，但是该组件被复用时调用，vue-router 内部会调用用户在组件内定义的 `beforeRouteUpdate` 钩子。但需要注意，需要将 `beforeRouteUpdate` 定义在路由根组件才能生效。

```js
export default {
  async beforeRouteUpdate(to, from, next) {
    this.users = await axios.get(`/api/user/${this.$route.params.id}`); // 获取最新数据
    next();
  }
}
```

### 8.3 方案三：增加 key，让组件强制重新渲染

`router-view` 上可以使用 key 属性，key 一旦发生变化，`router-view` 渲染的组件也会重新渲染。

```vue
<template>
  <router-view :key="$route.fullPath"></router-view>
</template>
```


## 结语
以上是整理的 Vue-router 的高频面试题，如有错误或者可以优化的地方欢迎评论区指正，后续还会其它前端相关面试题。

## 往期回顾
[前端高频面试题之Vue（初、中级篇）](https://mp.weixin.qq.com/s/i2VtrCVD2H6k77p1mjN4sQ)

[前端高频面试题之Vue（高级篇）](https://mp.weixin.qq.com/s/f09Y9QaO4NEMddat6Kc9Qg)

[前端高频面试题之Vuex篇](https://mp.weixin.qq.com/s/HxhldAJpYL7LDLooLDepWA)