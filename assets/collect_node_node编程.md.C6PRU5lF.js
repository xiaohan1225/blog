import{_ as a,c as i,o as n,ae as l}from"./chunks/framework.DE6vaMEz.js";const d=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/node/node编程.md","filePath":"collect/node/node编程.md"}'),e={name:"collect/node/node编程.md"};function p(t,s,h,k,r,o){return n(),i("div",null,s[0]||(s[0]=[l(`<h2 id="一、nodejs架构" tabindex="-1">一、Nodejs架构 <a class="header-anchor" href="#一、nodejs架构" aria-label="Permalink to &quot;一、Nodejs架构&quot;">​</a></h2><h2 id="全局变量process" tabindex="-1">全局变量process <a class="header-anchor" href="#全局变量process" aria-label="Permalink to &quot;全局变量process&quot;">​</a></h2><p>process是Nodejs内置的一个全局变量，用它可以获取很多信息。</p><ol><li>获取资源信息，包括内存、cpu</li></ol><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(process.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">memoryUsage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">输出结果：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">{</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  rss: 30494720, 常驻内存大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  heapTotal: 6438912, 堆内存大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  heapUsed: 5678760,  已使用的堆内存</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  external: 423221, c/c++底层模块加载占据的空间大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  arrayBuffers: 17606 缓存区大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">*/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(process.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cpuUsage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">输出结果：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 	user: 78000, 代码执行过程中，用户占用cpu的时间片段</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 	system: 0 代码执行过程中，操作系统占用cpu的时间片段</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * }</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span></code></pre></div><ol start="2"><li>获取运行环境信息，包括运行目录、node环境、cpu架构、用户环境、系统平台</li></ol>`,6)]))}const g=a(e,[["render",p]]);export{d as __pageData,g as default};
