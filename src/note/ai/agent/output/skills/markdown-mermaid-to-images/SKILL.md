---
name: markdown-mermaid-to-images
description: 将 Markdown 文件中的 Mermaid 代码块转换成 PNG 图片，并把原 Mermaid 代码围栏替换为图片链接。适用于准备发布到不直接渲染 Mermaid 的平台，尤其是 mdnice、微信公众号编辑器等场景。
---

# Markdown Mermaid 转图片

使用这个流程，把 Markdown 文件里的 Mermaid 图表转换成静态 PNG 图片，然后把每个 Mermaid 代码块替换成 Markdown 图片引用。

## 环境要求

- 如果本机已经安装 `mmdc`，优先使用 `mmdc`。
- 如果没有安装 `mmdc`，使用 `npx -y @mermaid-js/mermaid-cli` 临时调用 Mermaid CLI。
- 使用 `npx` 方案时，需要本机有 Node.js 和 npm/npx。
- 除非用户明确要求透明背景，否则默认使用白色背景，兼容微信公众号、mdnice 等编辑器。

## 操作流程

1. 定位 Markdown 文件里的 Mermaid 代码块：

```bash
rg -n '```mermaid|```' '<markdown-file>'
```

2. 在 Markdown 文件旁边创建图片输出目录：

```text
<markdown-basename>-assets/mermaid/
```

示例：

```text
article.md
article-assets/mermaid/diagram-01.png
```

3. 创建输出目录：

```bash
mkdir -p '<markdown-basename>-assets/mermaid'
```

4. 把 Mermaid 代码块抽取成编号 `.mmd` 文件。

优先使用脚本处理，不要手动复制。注意避免让 Markdown 里的反引号被 shell 解释。可以使用下面这个 Node.js 写法：

```bash
node -e 'const fs=require("fs"); const path=process.argv[1]; const out=process.argv[2]; const s=fs.readFileSync(path,"utf8"); const fence="```"; const re=new RegExp(fence+"mermaid\\n([\\s\\S]*?)\\n"+fence,"g"); let m,i=0; fs.mkdirSync(out,{recursive:true}); while((m=re.exec(s))){i++; fs.writeFileSync(out+"/diagram-"+String(i).padStart(2,"0")+".mmd", m[1].trim()+"\n");} console.log(i);' '<markdown-file>' '<output-dir>'
```

5. 把每个 `.mmd` 文件渲染成 PNG。

推荐命令：

```bash
for f in '<output-dir>'/*.mmd; do
  npx -y @mermaid-js/mermaid-cli \
    -i "$f" \
    -o "${f%.mmd}.png" \
    -b white \
    -w 1400 \
    -H 900 \
    -t default
done
```

除非文章需要特殊视觉风格，否则使用这些默认参数：

- `-b white`：白色背景，适合公众号编辑器。
- `-w 1400`：图片宽度 1400px，适合高清屏显示。
- `-H 900`：图片高度 900px，能覆盖常见流程图和时序图。
- `-t default`：使用 Mermaid 默认主题。

6. 把 Markdown 文件里的 Mermaid 代码块替换成图片链接。

图片链接使用相对路径，从 Markdown 文件指向生成的图片目录：

```bash
node -e 'const fs=require("fs"); const path=process.argv[1]; const rel=process.argv[2]; let s=fs.readFileSync(path,"utf8"); const fence="```"; const re=new RegExp(fence+"mermaid\\n([\\s\\S]*?)\\n"+fence,"g"); let i=0; s=s.replace(re,()=>{i++; return `![Mermaid 图 ${i}](${rel}/diagram-${String(i).padStart(2,"0")}.png)`;}); fs.writeFileSync(path,s); console.log(i);' '<markdown-file>' './<markdown-basename>-assets/mermaid'
```

7. 验证结果：

```bash
rg -n '```mermaid' '<markdown-file>' || true
ls -lh '<output-dir>'/*.png
```

正确结果应该是：Markdown 文件里不再有 Mermaid 代码围栏，并且生成的 PNG 数量和抽取出的 `.mmd` 文件数量一致。

## 注意事项

- 保留 `.mmd` 文件，后续修改图表或重新渲染时会用到。
- 如果第一次批量渲染卡住，先运行 `npx -y @mermaid-js/mermaid-cli --version`，然后再重新渲染。
- 如果某一张图渲染失败，逐个渲染 `.mmd` 文件，并检查失败文件里的 Mermaid 语法。
- 发布到 mdnice 或微信公众号时，PNG 通常比 SVG 更稳，复制和显示行为更可控。
- 如果 Markdown 路径包含中文、空格或特殊字符，命令里必须给路径加引号。

## 示例

对于文件：

```text
src/note/ai/agent/output/大模型科普-审校.md
```

使用输出目录：

```text
src/note/ai/agent/output/大模型科普-审校-assets/mermaid/
```

替换后的图片引用示例：

```markdown
![Mermaid 图 1](./大模型科普-审校-assets/mermaid/diagram-01.png)
```
