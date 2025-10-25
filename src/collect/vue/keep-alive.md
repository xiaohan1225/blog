## 与 keep-alive 相关钩子

1. **activated**：`<keep-alive>` 缓存的组件被激活时，会执行 `activated` 钩子。

```js
activated() {
  // 可以正常访问this
  // 可以在这里拉取接口更新数据
  this.getData();
}
```

2. **deactivated**：当使用 `<keep-alive>` 包裹的组件被切换离开时，组件会从激活状态变成非激活状态，此时会执行 `deactivated` 钩子。

```js
deactivated() {
  // 可以正常访问this 
  // 可以做一些状态的清除或者实例的销毁
  this.destroyInstance();
}
```


3. **beforeRouteEnter**：有在 `vue-router` 的项目中，每次进入路由都会执行 `beforeRouteEnter` 钩子。

```js
beforeRouteEnter(to, from ,next) {
  next(vm => {
    // 无法访问this，但可以通过 next 回调拿到组件实例 vm 
  });
}
```