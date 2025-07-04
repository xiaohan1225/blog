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