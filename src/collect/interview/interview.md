## SEO优化
1. tdk：title，description，keywords
2. SSR
  - vue同构渲染
  - 客户端注入
    - 页面中的DOM元素和虚拟节点建议联系
    - 添加事件绑定
步骤：
1. 客户端/服务端两个入口，vuex/vue-router不能单例
2. webpack打包配置，客户端和服务端分别打包
3. 数据预拉取：serverPrefetch，服务端数据同步到客户端 INITIAL_STATE
4. jsdom模拟客户端环境
5. 客户端激活`data-server-rendered="true"`

注意的坑：
1. 浏览器会在 `<table>` 内部自动注入 `<tbody>`，然而，由于 Vue 生成的虚拟 DOM (virtual DOM) 不包含 `<tbody>`，所以会导致无法匹配。为能够正确匹配，请确保在模板中写入有效的 HTML
2. 服务端渲染时，如果客户端有接口缓存，会导致无法渲染

优化性能：
1. 增加缓存，第一次走客户端渲染，之后走缓存，最大程度加快速度，缓存时间 30min

日志统计+报错监控：
1. 统计SSR成功率，收集报错，分析原因
2. 服务器性能监控，并发高时是否需要扩容

## webpack迁移到vite
核心目的：
1. 提升开发体验，热更新更快

vite特点：
1. no-bundle 热更新快
2. 不支持 commonjs

改造过程：
1. 增加依赖
  - `@originjs/vite-plugin-commonjs`: 将commonjs转为esm
  - `@originjs/vite-plugin-require-context`: 把require转化成import
  - `vite`: vite核心包
  - `vite-plugin-env-compatible`: 环境变量兼容，比如`process.env.xx`
  - `vite-plugin-svg-icons`: 兼容svg
  - `vite-plugin-vue2`: 兼容vue
2. 创建`vite.config.ts`
  - `server`：配置代理
  - `resolve.alias`：配置别名
  - `resolve.extensions`: 配置文件后缀
3. 改造入口，`index.html`放在根目录下，里面通过`script[type="module"]`引入`main.js`
4. css默认支持`sass`,不支持`node-sass`，需要更换（项目中一些node-sass语法需要更换，比如/deep/换成::v-deep）

## 设计模式
1. 单例模式
2. 发布订阅模式/观察者模式
3. 代理模式
4. 策略模式
5. 享元模式
共享内存，减少开销。

java里的String常量池，Integer的缓存池 等都是享元模式的体现。系统创建多个常用的对象，他们共用同一份内存，节省内存空间。

反向，有些因为公用内存引发bug，比如初始化时用了同一份对象

js应用：
1. 事件委托
2. 图片或资源加载，复用同一个DOM，避免重复加载资源
3. 虚拟列表
4. CSS类共享，在样式定义在css类上，通过增加类名和减少类名来控制样式


5. 工厂模式
6. 模板方法模式
它定义了一个算法的框架，并允许子类在不改变算法结构的情况下重写算法的某些步骤。模板方法模式通过将算法的通用部分放在父类中，而将可变部分留给子类实现，从而实现了代码复用和扩展性。

父类定义成抽象类，子类去实现。 vue的声明式框架，以及vue中的extends有点这种味道，但更好的写法是vue3 composition api，方便抽离和复用
7. 装饰者模式
8. 适配器模式
