## 前端为何要进行打包和构建
### 代码层面
- 体积更小（Tree-Shaking、压缩、合并），加载更快
- 编译高级语言或语法（TS、ES6+，模块化，scss）
- 兼容性和错误检查（Polyfill、postcss、eslint）

### 研发流程方面
- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成贵公司构建规范（提测、上线等）

## module、chunk、bundle的区别
- module-各个源码文件，webpack中一切皆模块
- chunk-多模板合并成的，如entry import() splitChunk
- bundle-最终的输出文件

## loader和plugin的区别
- loader模块转换器，如less -> css
- plugin扩展插件，如HtmlWebpackPlugin

## 常见的loader和plugin有哪些
### loader
- babel-loader
- eslint-loader
- file-loader
- url-loader
- css-loader
- less-loader
- sass-loader

### plugin
- HtmlWebpackPlugin
- DefinePlugin

## webpack构建流程
- 初始化参数，从shell脚本读取参数与配置文件进行合并，得到最终的配置对象
- 用上一步得到的配置对象，创建compiler对象，加载所有配置的参数，执行compiler对象的run方法进行编译
- 确定入口，根据配置中的entry找出所有的入口文件
- 编译模块，从入口模块出发，调用所有配置的loader对模块进行编译，再找出模块依赖的模块
- 输出资源，根据入口和模块的关系，打包成一个个的chunk，再把chunk转换成一个个单独的文件加入到输出列表
- 写入文件
