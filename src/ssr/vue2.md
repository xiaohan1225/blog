注意点：
1. `vue`的版本和`vue-server-renderer`的版本必须匹配，我用的都是`2.6.14`版本
2. 需要使用`history路由`，因为`hash路由`提交不到服务器上
3. 两个入口
4. 配置 `ssr plugin`，在 `webpack` 打包时生成 `manifest.json` 文件
5. 用三方库 `jsdom` 模拟 `window` 对象，`localstorage` 等环境

## 参考链接
[https://zhuanlan.zhihu.com/p/137319440](https://zhuanlan.zhihu.com/p/137319440)