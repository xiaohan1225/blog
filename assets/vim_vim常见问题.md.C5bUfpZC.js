import{_ as s,c as i,o as t,ae as e}from"./chunks/framework.CDwmhxVj.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"vim/vim常见问题.md","filePath":"vim/vim常见问题.md"}'),n={name:"vim/vim常见问题.md"};function l(r,a,o,p,c,h){return t(),i("div",null,a[0]||(a[0]=[e(`<h2 id="_1-在-insert-模式下使用-ctrl-c-复制-会进入-normal-模式怎么办" tabindex="-1">1. 在 insert 模式下使用 ctrl+ c（复制）会进入 normal 模式怎么办？ <a class="header-anchor" href="#_1-在-insert-模式下使用-ctrl-c-复制-会进入-normal-模式怎么办" aria-label="Permalink to &quot;1. 在 insert 模式下使用 ctrl+ c（复制）会进入 normal 模式怎么办？&quot;">​</a></h2><p>windows环境下，可以添加配置：</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vim.handleKeys&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;&lt;C-c&gt;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span></code></pre></div><p>其实更推荐大家用可视化模式去选中复制，而不是用 ctrl + c</p><h2 id="_2-在-insert-模式下是不是就不可以移动了-移动必须回-normal-模式吗" tabindex="-1">2. 在 insert 模式下是不是就不可以移动了？移动必须回 normal 模式吗？ <a class="header-anchor" href="#_2-在-insert-模式下是不是就不可以移动了-移动必须回-normal-模式吗" aria-label="Permalink to &quot;2. 在 insert 模式下是不是就不可以移动了？移动必须回 normal 模式吗？&quot;">​</a></h2><p>可以的，哪个更少按键就用哪个</p><p>当然也可以把 ctrl + hjkl 用软件映射成方向键，这样就更加方便。</p>`,7)]))}const _=s(n,[["render",l]]);export{m as __pageData,_ as default};
