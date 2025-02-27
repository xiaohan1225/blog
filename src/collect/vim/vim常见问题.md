## 1. 在 insert 模式下使用 ctrl+ c（复制）会进入 normal 模式怎么办？

windows环境下，可以添加配置：

```json
"vim.handleKeys": {
    "<C-c>": false
 }
```

其实更推荐大家用可视化模式去选中复制，而不是用 ctrl + c

##  2. 在 insert 模式下是不是就不可以移动了？移动必须回 normal 模式吗？

可以的，哪个更少按键就用哪个

当然也可以把 ctrl + hjkl 用软件映射成方向键，这样就更加方便。