## 安装perttier插件

先在vscode中安装 `Prettier - Code formatter`插件

## 创建配置文件

在项目根目录创建一个`.prettierrc`配置文件：

```json
// .prettierrc
{
  "singleQuote": true, // 使用单引号
  "tabWidth": 2, // 缩进
  "semi": false // 行尾是否添加分号
}

```



插件详细配置文件：https://prettier.io/docs/en/configuration.html

## 配置vscode自动保存格式化

`Ctrl + Shift + p`打开vscode的setting.json，加上如下配置：

```json
"editor.formatOnSave": true,
"editor.defaultFormatter": "bysabi.prettier-vscode-semistandard",
"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

