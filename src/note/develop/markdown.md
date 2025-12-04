## markdown基础语法

### 插入链接

[https://www.baidu.com](https://www.baidu.com)

### 任务列表
- [x] 每日任务1
- [ ] 每日任务2
- [ ] 每日任务3

使用 `- [x]` 表示已完成的任务。

使用 `- [ ]` 表示未完成的任务。

方括号 `[]` 内的 x 表示任务已完成，留空则表示未完成。

## 插入表格
使用`|`分隔列，`-`分隔表头和其他行:
```
| 列1标题 | 列2标题 | 列3标题 |
|---------|---------|---------|
| 内容A   | 内容B   | 内容C   |
| 内容D   | 内容E   | 内容F   |
```
效果：

| 列1标题 | 列2标题 | 列3标题 |
|---------|---------|---------|
| 内容A   | 内容B   | 内容C   |
| 内容D   | 内容E   | 内容F   |

在分割线中使用`:`控制对齐：
- `:--` 左对齐（默认）
- `:--:` 居中对齐
- `--:` 右对齐

```
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| 数据1  | 数据2   | 数据3  |
```

## vitepress的markdown扩展语法
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

这里的`{4}`表示高亮第4行。

## 显示红色字体

<font color='red'> text </font>

$\color{red}{红色字}$ 或者 $\color{FF0000}{红色字}$


## 插入图片

语法：`![替代文本](图片URL "可选标题")`

githubstars: 

![xiaohan1225's GitHub stats](https://github-readme-stats.vercel.app/api?username=xiaohan1225&show_icons=true&count_private=true&hide_border=true&include_all_commits=true&layout=compact)


访问`github`的图片：https://raw.githubusercontent.com/用户名/仓库名/分支名/资源目录/xxx.png