import{_ as a,c as n,o as i,ae as l}from"./chunks/framework.BFe6FF_l.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/interview/project/前端监控.md","filePath":"collect/interview/project/前端监控.md"}'),e={name:"collect/interview/project/前端监控.md"};function p(t,s,o,r,c,h){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h2 id="sdk数据采集与上报核心实现思路" tabindex="-1">SDK数据采集与上报核心实现思路 <a class="header-anchor" href="#sdk数据采集与上报核心实现思路" aria-label="Permalink to &quot;SDK数据采集与上报核心实现思路&quot;">​</a></h2><blockquote><p>这里只列举了核心指标收集与监控是数据整体流程，后续如果有需要自定义事件和数据采集的，可以借助 <code>MutationObserver</code> 或 <code>Performance API</code> 进行处理。</p></blockquote><h3 id="核心模块设计" tabindex="-1">核心模块设计 <a class="header-anchor" href="#核心模块设计" aria-label="Permalink to &quot;核心模块设计&quot;">​</a></h3><ol><li>网页性能指标采集（FP、FCP、CLS等）：通过 <code>Web-vitals</code> 采集这些性能指标。</li><li>异常采集：监控 js 错误，资源加载错误和未捕获的 Promise 错误。</li><li>点击事件采集：捕获用户点击行为，记录交互路径。</li><li>基础信息采集：采集 IP、机型、系统、浏览器等设备以及环境信息。</li><li>数据传输协议：统一封装不同类别的数据，发送给后端。</li></ol><h3 id="核心目标" tabindex="-1">核心目标 <a class="header-anchor" href="#核心目标" aria-label="Permalink to &quot;核心目标&quot;">​</a></h3><ol><li>插件化设计：支持性能、异常、点击事件等不同采集插件。</li><li>跨环境兼容：支持浏览器和 Node 服务端的数据上报。</li><li>代码解读：数据传输逻辑与采集逻辑分离，方便维护和扩展。</li><li>Monorepo：多包管理模式，提升代码复用和管理效率。</li></ol><h3 id="sdk-核心架构设计" tabindex="-1">SDK 核心架构设计 <a class="header-anchor" href="#sdk-核心架构设计" aria-label="Permalink to &quot;SDK 核心架构设计&quot;">​</a></h3><ul><li>@xiaohan/monitor-sdk-core <ul><li>定义核心逻辑和 Transport 接口。</li><li>负责插件初始化与注册。</li></ul></li><li>@xiaohan/monitor-sdk-browser <ul><li>浏览器相关插件：性能、异常、点击事件采集。</li><li>自定义浏览器 Transport 上报实现。</li></ul></li><li>@xiaohan/monitor-broser-utils <ul><li>提供浏览器环境下的工具方法。</li></ul></li><li>@xiaohan/monitor-sdk-node <ul><li>适配 Node 环境的 Transport 上报实现。</li></ul></li><li>@xiaohan/monitor-sdk-vue/react/angular/solid【拓展】</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>📦monitor</span></span>
<span class="line"><span> ┣ 📂packages</span></span>
<span class="line"><span> ┃ ┣ 📂browser # 浏览器端 SDK</span></span>
<span class="line"><span> ┃ ┃ ┗ 📂src</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜clicks.ts # 点击事件采集插件</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜error.ts # 异常捕获插件</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜index.ts # 浏览器端 SDK 入口</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜metrics.ts # 性能监控插件实现</span></span>
<span class="line"><span> ┃ ┃ ┃ ┗ 📜transport.ts # 浏览器 Transport 实现</span></span>
<span class="line"><span> ┃ ┣ 📂browser-utils # 浏览器通用工具包</span></span>
<span class="line"><span> ┃ ┃ ┗ 📂src</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜helper.ts # 浏览器环境基础信息获取</span></span>
<span class="line"><span> ┃ ┃ ┃ ┗ 📜index.ts # 导出工具方法</span></span>
<span class="line"><span> ┃ ┣ 📂core  # 核心 SDK，只定义公共逻辑和约束</span></span>
<span class="line"><span> ┃ ┃ ┗ 📂src</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜index.ts # 核心入口，初始化方法和接口</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜transport.ts # Transport接口定义和基类</span></span>
<span class="line"><span> ┃ ┃ ┃ ┗ 📜type.ts  # 公共类型定义</span></span>
<span class="line"><span> ┃ ┗ 📂node # Node端 SDK</span></span>
<span class="line"><span> ┃ ┃ ┗ 📂src</span></span>
<span class="line"><span> ┃ ┃ ┃ ┣ 📜index.ts # Node SDK 入口</span></span>
<span class="line"><span> ┃ ┃ ┃ ┗ 📜transport.ts # Node Transport 实现</span></span>
<span class="line"><span> ┗ 📜tsconfig.json # TypeScript配置文件</span></span></code></pre></div><h2 id="与-sentry-的差距" tabindex="-1">与 Sentry 的差距 <a class="header-anchor" href="#与-sentry-的差距" aria-label="Permalink to &quot;与 Sentry 的差距&quot;">​</a></h2><p>span 时间线</p><ul><li>列出所有的文件，每个文件执行的时</li><li>性能聚合，我们只上报了指标</li></ul><h2 id="clickhouse" tabindex="-1">clickhouse <a class="header-anchor" href="#clickhouse" aria-label="Permalink to &quot;clickhouse&quot;">​</a></h2><p>列式存储</p><p>表类型：</p><ol><li>引擎表</li><li>存储表</li><li>物化视图</li><li>视图</li></ol><p>创建普通引擎表：MergeTree</p><div class="language-spl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">spl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">CREATE TABLE base {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  id UInt64,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  name String,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  age UInt8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ENGINE </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MergeTree()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ORDER </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">BY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> id;</span></span></code></pre></div><h2 id="数据监控平台成果" tabindex="-1">数据监控平台成果 <a class="header-anchor" href="#数据监控平台成果" aria-label="Permalink to &quot;数据监控平台成果&quot;">​</a></h2><ol><li>用户反馈问题数量降低了 60%，以前一个月需要处理 60+ 个用户反馈问题，现在只需要处理 20+ 个，并且还在持续减少。</li></ol>`,20)])])}const u=a(e,[["render",p]]);export{k as __pageData,u as default};
