[https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode)

https://code.visualstudio.com/docs/editing/userdefinedsnippets


参考文章：https://zhuanlan.zhihu.com/p/457062272

## 前言

`snippets` 意思是片段，在 `vscode` 中可以通过 `Snippets：Configure Snippets`命令，来定义全局、项目级、语言级代码片段，可以以事先定好的规则来快速生成一段代码，进而大幅提升我们的开发效率。

## 如何创建 snippets？

snippets 文件以 JSON 编写，里面支持书写注释，并可定义无限数量的 snippets。

```json
{
  "base": {
		"prefix": ["base"],
		"body": [
      "<template>",
			"</template>",
			"",
			"<script lang=\"ts\">",
			"</script>",
			"",
			"<style lang=\"scss\" scoped>",
			"</style>"
    ],
		"description": "",
    "scope": "javascript,html",
	},
}
```

- **prefix**：必填，可以定义一个或多个触发词，由于子字符串匹配不是严格匹配的，因此输入 `bs` 可以匹配到 `base`。
- **body**：必填，表示正文，是一行或多行内容，插入时会合并为多行。换行和嵌入的标签页将根据插入摘要的上下文进行格式化。
  - 正文有三个占位符（按遍历顺序列出）：${1：数组}、${2：元素} 和 $0。你可以用 Tab 快速跳到下一个占位符，然后编辑占位符或跳到下一个。冒号后面的字符串 ：（如果有的话）是默认文本，例如 ${2：element} 中的元素 。占位符遍历顺序按数字递增，从一开始;零是一个可选的特殊情况，总是最后出现，并且在光标停留在指定位置时退出片段模式。
- **description**：可选，表示片段的描述。
- **scope**：可选，表示支持的语言，默认支持所有。

## snippets 支持语法

### Transform 变换

<!-- "${TM_FILENAME/[\\.]/_/}"	example-123_456-TEST.js -->

### Variables  变量

使用 `$name` 或 `${name：default}`，你可以插入变量的值。当变量未被设置时，默认值或空字符串会入。当变量未知（即其名称未定义）时，插入该变量名称并将其转换为占位符。

## 多人项目协作时如何实现 snippets 共享？


## 如何在 markdown 文件中使用 vscode snippets?


