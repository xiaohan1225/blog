---
name: xmind-mindmap-generation
description: 为文章生成 XMind 风格思维导图图片。适用于需要把文章核心内容提炼成结构化视觉图，并同时输出可编辑 SVG 和可发布 PNG，用于公众号、博客或文章末尾配图；重点覆盖节点提炼、层级设计、XMind 风格绘制、连线优化、文字溢出检查、PNG 导出和发布前验收。
---

# XMind 风格思维导图生成

使用这个技能，把一篇文章的核心内容提炼成一张 XMind 风格思维导图，并同时输出可编辑的 SVG 和可发布的 PNG。

## 适用场景

- 用户要求“给文章加一张思维导图”“生成 XMind 风格导图”“把核心内容提炼成图”。
- 目标平台是公众号、博客、mdnice 或其他不稳定支持 Mermaid/SVG 的发布环境。
- 需要视觉效果比 Mermaid 更接近手工设计：中心主题、彩色主分支、灰色子节点、自然曲线、点阵背景。

## 输出文件

默认在文章同目录生成 SVG 和 PNG：

```text
<文章标题>-思维导图-xmind风格.svg
<文章标题>-思维导图-xmind风格.png
```

SVG 用作可编辑源文件，便于后续微调节点、连线和文字；PNG 用作发布图片。文章正文默认引用 PNG，不直接引用 SVG。

如果用户要求把图片插入文章末尾，Markdown 引用 PNG：

```markdown
![<文章标题>思维导图](./<文章标题>-思维导图-xmind风格.png)
```

## 内容提炼流程

1. 先读文章标题、一级标题、二级标题、结论和列表。
2. 提炼 1 个中心主题，通常是文章标题的短版。
3. 提炼 4 到 6 个主分支，优先来自文章的一级结构。
4. 每个主分支保留 2 到 5 个子节点，子节点写文章里的关键判断、步骤或原则。
5. 不要把整段文章搬进图里。每个节点尽量是一句话，能让读者扫一眼知道重点。

## 层级规则

- 中心主题只表达“这张图讲什么”。
- 主分支表达文章的核心模块，比如“先明确”“去哪里找”“判断是否优质”“安装和维护”。
- 子节点表达具体动作、判断标准或注意事项。
- 同一判断维度必须在同一层级，不要因为画面排版把并列概念画成父子关系。
- 如果用户指出层级错误，先修结构，再修视觉。

示例：

```text
判断是否优质
├─ 来源可信
├─ 主文件可执行
├─ 长度合适
├─ 关键节点确认
└─ 低质量信号
```

其中“关键节点确认”和“长度合适”是同级节点，不能画成上下级。

## XMind 风格视觉

推荐先用 SVG 手工绘制源文件，再导出最终 PNG。SVG 和 PNG 都需要保留：SVG 方便修改，PNG 方便发布。

基础风格：

- 白色或浅色背景。
- 低透明度点阵背景。
- 左侧或中左放深色中心主题。
- 右侧展开彩色主分支。
- 主分支使用彩色圆角矩形。
- 子节点使用浅灰色圆角矩形。
- 主线较粗，子线较细。
- 连线使用圆角曲线，`stroke-linecap="round"`。
- 卡片圆角控制在 8 到 12px，不要过度圆润。
- 字体使用中文系统字体栈：`PingFang SC`、`Hiragino Sans GB`、`Microsoft YaHei`、`sans-serif`。

## SVG 绘制注意点

- 先定画布，再定节点，不要边写边无限挤压。
- 宽图优先，适合公众号文章阅读：常用 `2200x1500` 到 `2200x1700`。
- 每个节点使用明确的 `x/y/width/height`，避免依赖浏览器自动布局。
- 中文长句优先主动换行，用多个 `<text>`，不要指望 SVG 自动换行。
- 灰色子节点的宽度要按最长文本预留余量。
- 如果底部节点接近画布边缘，优先加高画布，不要硬挤节点。
- 保留 SVG，方便后续继续微调。

## 连线规则

- 主分支到中心节点使用较粗曲线，颜色和主分支一致。
- 主分支到多个子节点使用较细曲线，颜色和主分支一致。
- 多个子节点时，曲线应自然分散，避免线条交叉或贴近文字。
- 只有一个子节点时，优先用直线或轻微曲线，不要画夸张弧线。
- 子节点和主节点距离不能过远，否则连线会显得断裂或拖沓。
- 如果某条线太短，节点会像贴在主节点上；如果太长，读者会误以为结构关系弱。优先调整节点位置，再调整曲线控制点。

## 文字规则

- 主分支标题控制在 2 到 8 个汉字。
- 子节点尽量控制在 12 到 28 个汉字。
- 超过一行的节点要增加高度，并显式拆成两行。
- 中英文混排时，给英文单词留更多宽度，尤其是 `description`、`references`、`scripts`、`Anthropic` 这类长词。
- 不要让文字贴边，左右至少留 20px 内边距。
- 不要让文字超出灰色背景，发布前必须检查。

## 导出 PNG

优先用 npm 临时安装 `sharp`，从 SVG 导出 PNG：

```bash
tmp=$(mktemp -d)
npm install --prefix "$tmp" sharp >/dev/null 2>&1
node - <<'NODE' "$tmp" '<input.svg>' '<output.png>'
const tmp = process.argv[2];
const input = process.argv[3];
const output = process.argv[4];
const sharp = require(tmp + '/node_modules/sharp');
sharp(input, { density: 180 })
  .png()
  .toFile(output)
  .then(info => console.log(JSON.stringify(info)))
  .catch(err => { console.error(err); process.exit(1); });
NODE
rm -rf "$tmp"
```

导出后用 `ls -lh` 确认 SVG 和 PNG 都存在，再打开 PNG 目检。文章内默认只引用 PNG。

## 自动检查

### 节点重叠

导出前对 SVG 运行矩形重叠检查。结果应为 `overlaps 0`。

```bash
node - <<'NODE' '<input.svg>'
const fs=require('fs');
const file=process.argv[2];
const s=fs.readFileSync(file,'utf8');
const rects=[...s.matchAll(/<rect([^>]+)>/g)].map((m,i)=>{
  const attrs=Object.fromEntries([...m[1].matchAll(/([a-zA-Z]+)="([^"]+)"/g)].map(a=>[a[1],a[2]]));
  return {i, cls:attrs.class||'', x:+attrs.x||0, y:+attrs.y||0, w:+attrs.width||0, h:+attrs.height||0};
}).filter(r=>r.w&&r.h&&r.cls!=='bg'&&r.cls!=='');
function overlap(a,b,pad=0){return a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y;}
let hits=[];
for(let i=0;i<rects.length;i++) for(let j=i+1;j<rects.length;j++) if(overlap(rects[i],rects[j],0)) hits.push([rects[i],rects[j]]);
console.log('content rects', rects.length, 'overlaps', hits.length);
for(const [a,b] of hits) console.log(`overlap #${a.i} ${a.cls} (${a.x},${a.y},${a.w},${a.h}) with #${b.i} ${b.cls} (${b.x},${b.y},${b.w},${b.h})`);
NODE
```

### 灰色节点文字溢出

对 SVG 运行估算脚本，检查灰色子节点文字是否可能越界。结果应为 `gray_text_risks 0`。

```bash
node - <<'NODE' '<input.svg>'
const fs=require('fs');
const file=process.argv[2];
const s=fs.readFileSync(file,'utf8');
const rects=[];
for (const m of s.matchAll(/<rect([^>]+)>/g)) {
  const attrs=Object.fromEntries([...m[1].matchAll(/([a-zA-Z]+)="([^"]+)"/g)].map(a=>[a[1],a[2]]));
  if (!attrs.class || attrs.class === 'bg') continue;
  rects.push({cls:attrs.class, x:+attrs.x||0, y:+attrs.y||0, w:+attrs.width||0, h:+attrs.height||0});
}
const texts=[];
for (const m of s.matchAll(/<text([^>]*)>([^<]*)<\/text>/g)) {
  const attrs=Object.fromEntries([...m[1].matchAll(/([a-zA-Z-]+)="([^"]+)"/g)].map(a=>[a[1],a[2]]));
  texts.push({cls:attrs.class||'', anchor:attrs['text-anchor']||'start', x:+attrs.x||0, y:+attrs.y||0, text:m[2]});
}
function charWidth(cls) { return cls==='smallText' ? 13 : 14.5; }
let risks=0;
for (const t of texts) {
  const r=rects.find(r => t.x >= r.x && t.x <= r.x+r.w && t.y >= r.y && t.y <= r.y+r.h+8);
  if (!r || r.cls !== 'sub') continue;
  const est=t.text.length*charWidth(t.cls);
  const ok = t.anchor === 'middle' ? est <= r.w - 36 : est <= r.w - (t.x-r.x) - 18;
  if (!ok) { risks++; console.log('risk', {text:t.text, rect:`${r.x},${r.y},${r.w},${r.h}`, est:Math.round(est)}); }
}
console.log('gray_text_risks', risks);
NODE
```

## 目检清单

自动检查通过后，仍必须打开 PNG 目检：

- 文章核心内容是否都被覆盖，没有漏掉关键节点。
- 并列节点是否在同一层级。
- 是否有节点重叠、文字压线、文字超出灰色背景。
- 底部和右侧是否被裁切。
- 连线是否自然，是否过短、过长、穿过节点或贴近文字。
- 单子节点分支是否使用直线或轻微曲线。
- 主分支之间的上下间距是否足够。
- 长英文和中英文混排是否仍在背景框内。
- 缩小预览时主标题和主分支仍可读。

## 常见修正策略

- 文字超出：优先加宽节点；仍不够时拆成两行并加高节点。
- 节点太近：优先移动后续整组节点，不要只移动单个节点导致连线别扭。
- 底部裁切：增加 SVG `height` 和 `viewBox` 高度。
- 连线太长：把子节点左移，或让同组子节点纵向排列。
- 连线太短：把子节点右移，或让主节点和子节点之间保留 80 到 140px。
- 层级误读：不要只改线，优先调整同组节点的横向起点和纵向队列。
- 画面太散：减少子节点数量，保留文章最核心的判断和动作。

## 完成标准

交付前至少满足：

- SVG 和 PNG 都已生成。
- 文章默认引用最终 PNG。
- PNG 能正常打开。
- SVG 节点重叠检查为 `0`。
- SVG 灰色节点文字溢出风险为 `0`。
- 已完成一次人工目检。
- 如果用户要求插入文章，Markdown 已引用最终 PNG。
