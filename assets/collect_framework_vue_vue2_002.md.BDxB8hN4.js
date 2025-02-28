import{_ as i,c as a,o as n,ae as l}from"./chunks/framework.BHrE6nLq.js";const o=JSON.parse('{"title":"002 Vue2的虚拟DOM和diff算法","description":"","frontmatter":{"title":"002 Vue2的虚拟DOM和diff算法","date":"2022-03-29T00:00:00.000Z","categories":["Vue"],"tags":["Vue2.0"],"sidebar":"auto"},"headers":[],"relativePath":"collect/framework/vue/vue2/002.md","filePath":"collect/framework/vue/vue2/002.md"}'),e={name:"collect/framework/vue/vue2/002.md"};function h(t,s,p,k,d,E){return n(),a("div",null,s[0]||(s[0]=[l(`<h2 id="背景" tabindex="-1">背景 <a class="header-anchor" href="#背景" aria-label="Permalink to &quot;背景&quot;">​</a></h2><ul><li>DOM操作非常耗费性能（js操作比较快）</li><li>以前命令式的jquery可以自行控制操作DOM的时机，而对于声明式的靠数据驱动视图的vue和react，需要更加有效地控制DOM操作</li><li>由react首先提出，vue2.0开始采用，借鉴了<a href="https://github.com/snabbdom/snabbdom" target="_blank" rel="noreferrer">snabbdom</a>的实现，并添加了许多自己的特性</li></ul><blockquote><p><code>Vue</code>在<code>1.0</code>版本的时候是没有引入<code>虚拟DOM</code>，由于响应式系统的存在，<code>Vue</code>可以精确地知道具体哪些节点的状态发生了变化，从而对这些节点进行细粒度的<code>更新操作</code>，根本不需要比对。然而这种方式的缺陷在于要为每个节点创建一个<code>Watcher</code>，在项目复杂时，其<code>创建Watcher</code>的内存开销和进行<code>依赖追踪</code>的开销就会很大。<br> 于是<code>Vue</code>在<code>2.0</code>版本时引入了<code>虚拟DOM</code>，将组件的更新粒度变为<code>中等粒度</code>，每一个组件对应一个<code>Watcher</code>，即使同一时间组件里的多个状态均发生变化，组件也只会<code>更新一次</code>。</p></blockquote><h2 id="解决方案-vdom" tabindex="-1">解决方案-vdom <a class="header-anchor" href="#解决方案-vdom" aria-label="Permalink to &quot;解决方案-vdom&quot;">​</a></h2><ul><li>有了一定的复杂度，想减少计算次数比较难</li><li>但可以把计算更多地转移为js计算，因为js执行速度很快</li><li>用js模拟DOM结构，计算出最小的变更，操作DOM</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    tag</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;div&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    props</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;div1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        className</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;container&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    children</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;p&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            children: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    tag: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    text: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;vdom&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ul&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            props: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                style: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    fontSize: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;20px&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            children: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;li&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    props: {},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    children: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                            tag: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                            text: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="vdom的作用" tabindex="-1">vdom的作用 <a class="header-anchor" href="#vdom的作用" aria-label="Permalink to &quot;vdom的作用&quot;">​</a></h2><ol><li>保证性能下限</li><li>跨平台</li></ol><h2 id="diff算法" tabindex="-1">diff算法 <a class="header-anchor" href="#diff算法" aria-label="Permalink to &quot;diff算法&quot;">​</a></h2><h3 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h3><ul><li>diff算法是vdom中最核心、最关键的部分</li><li>diff算法能在日常使用vue react中体现出来（如key 随机数没用 每次重新渲染都是新的随机数）</li><li>diff即对比，是一个广泛的概念，如linux diff命令、git diff等</li><li>两个js对象也可以做diff</li><li>两棵树做diff，如vdom diff</li></ul><h3 id="树diff的时间复杂度是o-n-3" tabindex="-1">树diff的时间复杂度是O(n ^ 3) <a class="header-anchor" href="#树diff的时间复杂度是o-n-3" aria-label="Permalink to &quot;树diff的时间复杂度是O(n ^ 3)&quot;">​</a></h3><ul><li>第一遍历tree1，第二，遍历tree2，第三，排序</li><li>1000个节点，要计算1亿次，算法不可用</li></ul><h3 id="优化时间复杂度到o-n" tabindex="-1">优化时间复杂度到O(n) <a class="header-anchor" href="#优化时间复杂度到o-n" aria-label="Permalink to &quot;优化时间复杂度到O(n)&quot;">​</a></h3><ul><li>只比较同一层级，不跨级比较</li><li>tag不相同，则直接删掉重建，不再深度比较</li><li>tag和key，两者都相同，则认为是相同节点，不再深度比较</li></ul><h3 id="patch方法" tabindex="-1">patch方法 <a class="header-anchor" href="#patch方法" aria-label="Permalink to &quot;patch方法&quot;">​</a></h3><p>patch方法是将vnode渲染成真实的DOM，它主要做三件事：</p><ol><li>创建新增的节点</li><li>删除多余的节点</li><li>修改需要更新的节点</li></ol><p>比较策略：</p><ul><li>vnode相同，走patchVnode</li><li>vnode不同，删除重建</li></ul><h3 id="diff算法总结" tabindex="-1">diff算法总结 <a class="header-anchor" href="#diff算法总结" aria-label="Permalink to &quot;diff算法总结&quot;">​</a></h3><ul><li>patchVnode</li><li>addVnodes removeVnodes</li><li>updateChildren(key的重要性)</li></ul><h2 id="vdom和diff总结" tabindex="-1">vdom和diff总结 <a class="header-anchor" href="#vdom和diff总结" aria-label="Permalink to &quot;vdom和diff总结&quot;">​</a></h2><ul><li>vnode的核心概念：h、vnode、patch、diff、key等</li><li>vnode存在的价值：数据驱动视图，控制DOM操作</li></ul>`,24)]))}const c=i(e,[["render",h]]);export{o as __pageData,c as default};
