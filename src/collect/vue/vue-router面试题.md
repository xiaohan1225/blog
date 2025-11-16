## vue-router有几种钩子函数?具体是什么及执行流程是怎样的?

钩子函数种类有:全局守卫、路由守卫、组件守卫

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## vue-router两种模式的区别？

- hash模式：hash + hashChange 兼容性好但是不美观
- history模式: historyApi+ popState 虽然美观，但是刷新会出现404需要后端进行配置

## vue 项目本地开发完成后部署到服务器后报 404 是什么原因呢？

如果你使用的是 Vue Router 的 history 模式。刷新时会像服务端发起请求，服务端无法响应到对应的资源，所以会出现 404 问题。需要在服务端进行处理将所有请求重定向到你的 Vue 应用的入口文件。

配置后服务端不会在出现 404 问题，Vue 应用中要覆盖所有的路由情况。

`nginx.conf` 配置方式：
```bash
location / {
  try_files $uri $uri/ /index.html;
}
```