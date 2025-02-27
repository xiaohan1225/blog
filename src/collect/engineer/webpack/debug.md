<!-- ---
title: 001 如何调试测试环境和生产环境代码
date: 2021-05-16
categories:
  - Webpack
tags:
  - Webpack
sidebar: "auto"
--- -->
## 测试环境调试
webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  devtool: false,
  entry: './src/index.js',
  resolveLoader:{
    modules:['node_modules','loaders']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
             options: { 
              sourceMap: true,
              importLoaders:2
             }
          },
          //{ loader: "resolve-url-loader" },
          { loader: "resolve-scss-url-loader" },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.SourceMapDevToolPlugin({
      append: '//# sourceMappingURL=http://127.0.0.1:8081/[url]',
      filename: '[file].map',
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [{
          source: './dist/*.map',
          destination: 'C:/aprepare/zhufengsourcemap/sourcemap',
        }],
        delete: ['./dist/*.map'],
        archive: [{ 
          source: './dist',
          destination: './dist/dist.zip',
        }]
      }
    })
  ]
}
```

## 生产环境调试
1. 打包。将devtool设置为hidden-source-map,这个设置的意思是也会打包生成sourcemap文件，但是并不会在bundle.js中制定map文件的位置，也就是没有sourceMappingURL。
2. 将map文件挑出放到本地服务器，将不含有map文件的部署到服务器，借助第三方软件（例如fiddler），将浏览器对map文件的请求拦截到本地服务器，就可以实现本地sourceMap调试
```
regex:(?inx)http:\/\/localhost:8080\/(?<name>.+)$
*redir:http://127.0.0.1:8081/${name}
```

## npm run build的时候干了什么？
1. npm内部会临时将node_modules中.bin下面的文件添加到环境变量中去，执行npm run build命令，会执行node_modules中.bin文件夹中的webpack.cmd文件
2. 用node执行文件node_modules/webpack/bin/webpack.js

npm i的时候，会扫描安装包的package.json文件，将其安装到node_modules下.bin文件夹中