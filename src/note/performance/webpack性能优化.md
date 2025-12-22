
## 前言

虽然现在 `vite` 比较火，但很多公司中还是存在一些将 `webpack` 作为构建工具的前端老项目。 

最近在优化公司的一个`webpack项目`，所以整理了`webpack`常见的优化手段，一起来看看吧！

## 1、优化方向

webpack 的优化瓶颈主要是两方面：
1. 打包构建过程耗时太长。
2. 打包结果体积太大。

所以我们从这两方面展开优化：
1. **webpack 如何优化打包构建速度**？这是为了提高`打包上线速度`，另外也可以降低`热更新`时间，提升开发体验。
2. **webpack 如何优化产出代码**？这个是为了提升`产品性能`。


## 2、优化方向一：打包构建速度
### 2.1 优化 babel-loader

通过使用 `include` 和 `exclude`，在尽可能少的模块上执行 `loader`，从而提升构建速度。
```js
{
  test: /\.js/,
  use: ['babel-loader?cacheDirectory'], // 开启缓存
  include: path.resolve(__dirname, 'src'), // 明确范围
  // 排除范围，include和exclude两者选其一即可
  // exclude: path.resolve(__dirname, 'node_modules')
}
```
### 2.2 IgnorePlugin：可以避免引用无用模块
举个例子：

`import moment from 'moment'`默认会引入所有语言的JS代码，我们很多时候其实只引入中文就够了。
```js
// 使用
import moment from 'moment' // 235.4k (gzipped: 66.3k)
import 'moment/locale/zh-cn' // 手动引入中文语言包
moment.locale('zh-cn') // 设置语言为中文
console.log('locale', moment.locale())
console.log('date', moment().format('ll')) // 2021年xx月xx日
```
```js
{
  plugins: [
    // 忽略 moment 下的locale目录
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}
```
### 2.3 noParse：避免重复打包
```js
module.exports = {
  module: {
    // 忽略对`react.min.js`文件的递归解析处理
    noParse: [/react\.min\.js/],
  }
}

```
`IgnorePlugin` vs `noParse` ：
- `IgnorePlugin` 直接不引入，代码中没有。
- `noParse` 引入，但不打包。
### 2.4 happyPack：多进程打包
- JS 单线程，开启多进程打包。
- 提高构建速度（利用多核CPU）。
```js
const HappyPack = require('happypack')
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对.js文件的处理转交给id为babel的HappyPack实例
        use: ['happypack/loader?id=babel'],
        include: path.resolve(__dirname, 'src'),
      }
    ]
  }，
  plugins: [
    new HappyPack({
      // id代表当前的HappyPack是用来处理一类特定的文件
      id: 'babel',
      // 如何处理.js文件，用法和Loader配置中一样
      loaders: ['babel-loader?cacheDirectory'],
    })
  ]
}
```

### 2.5 ParallelUglifyPlugin：多进程压缩JS
- webpack内置 Uglify 工具压缩JS。
- JS单线程，开启多进程压缩更快。
- 和 happyPack 同理。
```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
module.exports = {
  plugins: [
    // 并行压缩JS
    new ParallelUglifyPlugin({
      // 还是使用UglifyJS压缩，只不过帮助开启了多进程
      uglifyJS: {
        output: {
          beautify: false, // 最紧凑的输出
          comments: true, // 删除所有的注释
        },
        compress: {
          // 删除所有的`console`语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提起出出现多次但是没有的定义成变量去引用的静态值
          reduce_vars: true,
        }
      }
    })
  ]
}
```

关于开启多进程：
- 项目较大，打包较慢，开启多进程能提高速度。
- 项目较小，打包很快，开启多进程会降低速度（进程开销）。
- 按需使用。

### 2.6 自动刷新
```js
module.exports = {
  watch: true, // 开启监听，默认为false
  // 注意：开启监听之后，webpack-dev-server会自动开启刷新浏览器！！！
  // 监听配置
  watchOptions: {
    ignored: /node_modules/,
    // 防抖300ms，防止编译频率太高
    aggregateTimeout: 300, // 默认为300ms
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化来实现的
    poll: 1000, // 默认每隔1000毫秒询问一次
  }
}
```
一般配置 `webpack-dev-server` 就够了。
### 2.7 热更新
- 自动刷新：整个网页全部刷新，速度较慢，状态会丢失。
- 热更新：新代码生效，网页不刷新，状态不丢失。
```js
// webpack.config.js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
module.exports = {
  entry: {
    index: [
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server',
      path.join(__dirname, 'src', 'index.js'),
    ],
    other: path.join(__dirname, 'src', 'other.js'),
  },
  devServer: {
    port: 8080,
    progress: true, // 显示打包的进度条
    contentBase: path.join(__dirname, 'dist'), // 根目录
    open: true, // 自动打开浏览器
    compress: true, // 启动gzip压缩

    hot: true,
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ]
}

// index.js
const hello = require('./hello')
if (module.hot) {
  module.hot.accept(['./hello'], () => {
    console.log(hello) 
  })
}
```
### 2.8 DllPlugin：动态链接库插件
- 前端框架如 Vue、React，体积大，构建慢。
- 较稳定，不常升级版本。
- 同一个版本只构建一次即可，不用每次都重新构建。

**其使用方式如下**：
- webpack 已内置 DllPlugin 支持。
- DllPlugin - 打包出 dll 文件。
- DllReference - 使用 dll 文件。

```js
// webpack.dll.js 单独抽离一个dll配置文件
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
const distPath = path.join(__dirname, 'dist')
module.exports = {
  mode: 'development',
  entry: {
    // 把React相关模块放到一个单独的动态链接库
    react: ['react', 'react-dom'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name]代表当前动态链接库的名称，也就是entry中配置的react
    filename: '[name].dll.js',
    // 输出的文件目录
    path: distPath,
    // 存放动态链接库的全局变量名称，例如对用react来说就是_dll_react
    // 之所以在前面加上_dll是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    new DllPlugin({
      // 动态链接库的全局变量名，需要和output.library中保持一致
      // 该字段的值也就是输出的manifest.json文件中name字段的值
      // 例如react.manifest.json中就有"name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的manifest.json文件输出时的文件名称
      path: path.join(distPath, '[name].manifest.json'),
    })
  ]
}

// package.json
{
  "scripts": {
    "dll": "webpack --config webpack.dll.js"
  }
}
// 先运行npm run dll打包出react.dll.js和react.manifest.json文件

// webpack.dev.js
const path = require('path')
// 一、使用react.manifest.json文件
// 1.引入DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
const srcPath = path.join(__dirname, 'src', 'index.js')
const distPath = path.join(__dirname, 'dist')
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js/,
        loader: ['babel-loader'],
        include: srcPath,
        // 2.不要再转换node_modules
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    // 3.告诉webpack使用了哪些动态链接库
    new DllReferencePlugin({
      manifest: require(path.join(distPath, 'react.manifest.json')),
    })
  ]
}

```
```html
<!-- 二、使用react.dll.js文件 -->
<!-- index.html -->
<script src="./react.dll.js"></script>
```



## 3、优化方向二：产出代码
**优化目的**：
- 体积更小。
- 合理分包，不重复加载。
- 速度更快、内存使用更少。

可以采用如下的优化策略进行优化。
### 3.1 小图片base64编码
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            outputPath: '/img/',
            // 设置图片的cdn地址（也可以统一在外面的output中）
            // publicPath: 'http://cdn.abc.com',
          }
        }
      }
    ]
  }
}
```
### 3.2 bundle 加 hash
```js
module.exports = {
  output: {
    filename: '[name].[contentHash:8].js',
    path: distPath,
    // 修改所有静态文件url的前缀
    // publicPath: 'http://cdn.abc.com', 
  }
}
```
### 3.3 懒加载
打包 `import()`、组件、路由、组件的异步加载，图片的懒加载等。
### 3.4 提取公共代码 splitChunks
```js
module.exports = {
  optimization: {
    // 压缩css
    // minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin()]
    splitChunks: {
      /**
      initial 入口chunk，对于异步导入的文件不处理
      async 异步chunk，只对异步导入的文件处理
      all 全部chunk
      */
      chunks: 'all',
      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor',
          priority: 1, // 权限更高，优先抽离
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1, // 最少复用过几次
        }
        // 公共的模块
        common: {
          name: 'common',
          priority: 0,
          minSize: 0,
          minChunks: 2,
        }
      }
    }
  }
}
```
### 3.5 IgnorePlugin
可以使用`IgnorePlugin`减少打包体积。
### 3.6 使用 CDN 加速
- 可以将前端打包后的静态资源`html css js`等全部上传到`CDN`，以加快访问速度。
- 也可以只将一些第三方库上传到`CDN`，将 `CDN` 链接内置于 `html` 模版中，然后配合 `externals` 配置，以减少打包体积。

```js
// webpack.config.js
module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
  }
}
```
### 3.7 使用 production
```js
// webpack.config.js
module.exports = {
  mode: 'production',
}
```
- 自动开启代码压缩。
- Vue、React 等框架会自动删除调试代码（如开发环境的warning）。
- 启动 Tree-Shaking。
### 3.8 使用 Scope Hosting
- 代码体积更小。
- 创建函数作用域更少。
- 代码可读性更好。

打包文件：
```js
// hello.js
export default 'Hello'

// main.js
import str from './hello.js'
console.log(str)
```

**默认打包结果**：
```js
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(1);
    console.log(__WEBPACK_IMPORTED_MODULE_0__util_js__["a"]);
  }),
  (function (module, __webpack_exports__, __webpack_require__) {
    __webpack_exports__["a"] = ('hello');
  }),
]
```

**开启 Scope Hosting**：
```js
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var hello = ('hello');
    console.log(hello);
  }),
]
```

**配置 Scope Hoisting**：
```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
module.exports = {
  resolve: {
    // 针对npm中的第三方模块优先采用jsnext:main中指向的ES6模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  plugins: [
    // 开启Scope Hoisting
    new ModuleConcatenationPlugin(),
  ]
}
```

## 小结


**构建速度优化总结**：
1. webpack优化构建速度（`用于生产环境`）：
- 优化 babel-loader。
- IgnorePlugin。
- noParse。
- happyPack。
- ParallelUglify（这个一般只会用于生产环境）。

2. webpack优化构建速度（`用于开发环境`）：
- 自动刷新。
- 热更新。
- DllPlugin。

**产出代码优化总结**：
- 小图片 base64 编码。
- bundle 加 hash。
- 懒加载。
- 提取公共代码 splitChunks。
- IgnorePlugin。
- 使用 CDN 加速。
- 使用 production。
- 使用 Scope Hosting。

`webpack`优化一直是老生常谈的话题，上面给大家介绍了很多优化思路，大家可以根据自己的项目需要去运用`合理的优化策略`，以达到最好的优化状态。

## 往期回顾
- [前端性能优化之CSS篇](https://mp.weixin.qq.com/s/0Gl2sGa2Ev44tyrSYjjyFg)
- [前端遇到页面卡顿问题，如何排查和解决？](https://mp.weixin.qq.com/s/eIKLx_kegGzrB00KXeKYLQ)