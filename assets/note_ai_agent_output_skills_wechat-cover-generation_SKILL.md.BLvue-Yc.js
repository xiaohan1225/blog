import{_ as s,o as n,c as l,ae as i}from"./chunks/framework.wE_VpzFx.js";const u=JSON.parse('{"title":"微信公众号封面生成","description":"生成微信公众号文章封面图，尤其适用于科技、AI、产品、教程、知识科普类文章。使用 AI 图像生成能力创建横版公众号封面，并沉淀标题、副标题、主体视觉、构图、配色、文字可读性和导出验收流程。","frontmatter":{"name":"wechat-cover-generation","description":"生成微信公众号文章封面图，尤其适用于科技、AI、产品、教程、知识科普类文章。使用 AI 图像生成能力创建横版公众号封面，并沉淀标题、副标题、主体视觉、构图、配色、文字可读性和导出验收流程。"},"headers":[],"relativePath":"note/ai/agent/output/skills/wechat-cover-generation/SKILL.md","filePath":"note/ai/agent/output/skills/wechat-cover-generation/SKILL.md"}'),e={name:"note/ai/agent/output/skills/wechat-cover-generation/SKILL.md"};function p(t,a,c,o,r,d){return n(),l("div",null,[...a[0]||(a[0]=[i(`<h1 id="微信公众号封面生成" tabindex="-1">微信公众号封面生成 <a class="header-anchor" href="#微信公众号封面生成" aria-label="Permalink to &quot;微信公众号封面生成&quot;">​</a></h1><p>使用这个技能，为公众号文章生成横版封面图。适合文章标题已经确定、需要一张能在公众号列表和文章页里都清晰展示的封面。</p><h2 id="使用的能力" tabindex="-1">使用的能力 <a class="header-anchor" href="#使用的能力" aria-label="Permalink to &quot;使用的能力&quot;">​</a></h2><ul><li>使用 AI 图像生成能力生成位图封面。</li><li>不是用 HTML/CSS、SVG 或 Mermaid 绘制。</li><li>适合生成带有科技感背景、主题视觉、中文标题、英文/中文副标题的完整封面。</li></ul><h2 id="默认规格" tabindex="-1">默认规格 <a class="header-anchor" href="#默认规格" aria-label="Permalink to &quot;默认规格&quot;">​</a></h2><ul><li>画幅：横版宽屏。</li><li>推荐比例：<code>2.35:1</code> 或接近公众号封面常用宽图比例。</li><li>推荐尺寸：<code>1920x817</code>、<code>1600x680</code> 或同等宽高比。</li><li>背景：深色科技风、真实质感、避免纯渐变背景。</li><li>标题：大号中文主标题，必须清晰、居中或偏下展示。</li><li>副标题：放在主标题下方，字号小于主标题。</li></ul><h2 id="生成前确认" tabindex="-1">生成前确认 <a class="header-anchor" href="#生成前确认" aria-label="Permalink to &quot;生成前确认&quot;">​</a></h2><p>生成前先提取这些信息：</p><ul><li>文章主题：文章到底讲什么。</li><li>主标题：封面上最重要的一句话。</li><li>副标题：模型名、栏目名、关键词或补充说明。</li><li>目标受众：普通用户、开发者、产品经理、企业客户等。</li><li>风格方向：科技感、商务、极简、知识科普、赛博、未来感等。</li></ul><p>如果用户没有指定，默认使用：</p><ul><li>目标受众：普通公众号读者。</li><li>风格方向：深色科技感。</li><li>构图：中心主体视觉 + 底部大标题。</li></ul><h2 id="提示词结构" tabindex="-1">提示词结构 <a class="header-anchor" href="#提示词结构" aria-label="Permalink to &quot;提示词结构&quot;">​</a></h2><p>按这个结构写图像生成提示词：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>生成一张微信公众号横版封面图，比例约 2.35:1，主题是「&lt;文章主题&gt;」。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>画面主体：</span></span>
<span class="line"><span>&lt;主体视觉描述，例如中心是发光 AI 芯片和神经网络大脑，两侧连接全球模型生态、代码、文档、对话、工具等图标。&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>构图：</span></span>
<span class="line"><span>中心主体清晰，左右有信息流和图标延展，底部留出大标题区域。画面不能拥挤，标题区域要干净。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>文字：</span></span>
<span class="line"><span>主标题：「&lt;主标题&gt;」</span></span>
<span class="line"><span>副标题：「&lt;副标题&gt;」</span></span>
<span class="line"><span>主标题使用大号中文字体，清晰、锐利、高对比度，不要变形，不要错字。副标题放在主标题下方。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>风格：</span></span>
<span class="line"><span>&lt;风格描述，例如深色科技风、蓝色与橙色对比、发光线条、数字地图、AI 芯片、专业知识科普封面、电影级光影。&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>质量要求：</span></span>
<span class="line"><span>高清、锐利、适合公众号封面、文字可读、不要水印、不要多余英文乱码、不要伪 logo。</span></span></code></pre></div><h2 id="示例提示词" tabindex="-1">示例提示词 <a class="header-anchor" href="#示例提示词" aria-label="Permalink to &quot;示例提示词&quot;">​</a></h2><p>用于“一篇看懂主流大模型”这类 AI 科普文章：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>生成一张微信公众号横版封面图，比例约 2.35:1，主题是「主流大模型科普」。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>画面主体：</span></span>
<span class="line"><span>中心是发光的 AI 芯片和神经网络大脑，左侧用蓝色表现国外模型生态，右侧用橙色表现中国模型生态。两侧有代码、文档、图片、对话气泡、工具、机器人等图标，通过发光线条连接到中心 AI 芯片。背景可以有世界地图和中国地图的数字点阵轮廓。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>构图：</span></span>
<span class="line"><span>中心主体清晰，左右信息流向中心汇聚，底部留出大标题区域。整体宽屏封面，画面不能太满，标题区域要干净。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>文字：</span></span>
<span class="line"><span>主标题：「一篇看懂 主流大模型」</span></span>
<span class="line"><span>副标题：「GPT · Claude · Gemini · DeepSeek · 通义千问」</span></span>
<span class="line"><span>主标题使用大号中文字体，清晰、锐利、高对比度，不要变形，不要错字。副标题放在主标题下方。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>风格：</span></span>
<span class="line"><span>深色科技风，蓝色与橙色对比，发光线条，数字地图，AI 芯片，专业知识科普封面，电影级光影。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>质量要求：</span></span>
<span class="line"><span>高清、锐利、适合公众号封面、文字可读、不要水印、不要多余英文乱码、不要伪 logo。</span></span></code></pre></div><h2 id="文字处理原则" tabindex="-1">文字处理原则 <a class="header-anchor" href="#文字处理原则" aria-label="Permalink to &quot;文字处理原则&quot;">​</a></h2><ul><li>中文标题必须短，尽量控制在 6 到 14 个汉字。</li><li>不要让图像模型生成太多小字，小字容易乱码。</li><li>如果标题很长，拆成两段，例如：</li></ul><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>一篇看懂</span></span>
<span class="line"><span>主流大模型</span></span></code></pre></div><ul><li>品牌名、模型名可以放副标题，但不要太多。</li><li>如果生成图里的文字错了，优先重新生成；如果只差少量字，可用图像编辑或本地设计工具补字。</li></ul><h2 id="构图原则" tabindex="-1">构图原则 <a class="header-anchor" href="#构图原则" aria-label="Permalink to &quot;构图原则&quot;">​</a></h2><ul><li>主视觉放中间或偏上，不要压住标题。</li><li>标题区域放底部，背景要相对干净。</li><li>公众号封面在列表里会被缩小，标题必须在小图下仍能读。</li><li>科技类封面可以使用蓝橙对比、发光线条、芯片、大脑、网络节点、地图、代码、文档、对话框等元素。</li><li>不要使用杂乱小图标堆满画面。</li></ul><h2 id="验收标准" tabindex="-1">验收标准 <a class="header-anchor" href="#验收标准" aria-label="Permalink to &quot;验收标准&quot;">​</a></h2><p>生成后检查：</p><ul><li>主标题是否完整、无错字、无变形。</li><li>副标题是否可读，是否出现乱码。</li><li>画面主题是否和文章内容一致。</li><li>小尺寸预览时标题是否仍然清晰。</li><li>是否没有水印、伪 logo、多余文字。</li><li>是否适合公众号封面裁切，不会把核心标题裁掉。</li></ul><h2 id="常见问题" tabindex="-1">常见问题 <a class="header-anchor" href="#常见问题" aria-label="Permalink to &quot;常见问题&quot;">​</a></h2><ul><li>如果文字不清楚：减少文字数量，放大标题，要求标题区域更干净。</li><li>如果画面太乱：减少图标数量，强调中心主体和左右少量信息流。</li><li>如果中文错字多：把文字生成和背景生成拆开，先生成无字背景，再用设计工具加字。</li><li>如果封面像通用素材：加入文章主题里的具体关键词、模型名、使用场景和受众。</li><li>如果颜色太单调：用双色对比，例如蓝色代表全球技术生态，橙色代表中国模型生态。</li></ul>`,28)])])}const b=s(e,[["render",p]]);export{u as __pageData,b as default};
