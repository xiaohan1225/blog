## 两种配置方式

1. 数组形式

```js
new ModuleFederationPlugin({
  shared: ['react', 'react-dom']
})
```

1. 自动从 `package.json` 读取版本
2. 应用默认共享策略
3. 适合快速原型开发

2. 对象形式

```js
new ModuleFederationPlugin({
  shared: {
    react: { singleton: true, eager: true, requiredVersion: '^17.0.2', strictVersion: false },
    'react-dom': { singleton: true, eager: true, requiredVersion: '^17.0.2' }
  }
})
```

1. 精确控制每个依赖的共享行为
2. 更加灵活的版本管理
3. 更好的错误处理机制

核心参数：
### Singleton（单例模式）
作用：在整个应用中是否只存在一个实例。
默认值：-

### requiredVersion（版本范围）
作用：指定依赖的版本范围。
语法：支持 `^`、`~`、`>=` 等 `semver` 操作符。
默认值：从 `package.json` 中读取。

### strictVersion（严格模式）
作用：为 true 时，严格匹配版本号，为 false 时，遵循 `semver` 匹配规则。
默认值：`false`。

### eager（加载策略）
作用：为 true 时，立即加载依赖，为 false 时，按需加载。
默认值：`false`。
使用场景：对于应用的核心依赖，如 `react`、`react-dom` 等，建议设置为 `true`，以避免在应用启动时出现依赖加载失败的情况。
