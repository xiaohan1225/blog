import{_ as i,c as a,o as t,ae as l}from"./chunks/framework.BHrE6nLq.js";const g=JSON.parse('{"title":"003 HTML、CSS、JavaScript是如何渲染成页面的？","description":"","frontmatter":{"title":"003 HTML、CSS、JavaScript是如何渲染成页面的？","date":"2021-07-12T00:00:00.000Z","categories":["浏览器工作原理"],"tags":["浏览器渲染原理"],"sidebar":"auto"},"headers":[],"relativePath":"collect/browser/003.md","filePath":"collect/browser/003.md"}'),n={name:"collect/browser/003.md"};function e(p,s,r,h,o,k){return t(),a("div",null,s[0]||(s[0]=[l(`<p>我们可以通过编写HTML、CSS和JavaScript文件来让浏览器展示出一个漂亮的页面，但它们是如何转化成页面的呢？</p><p>由于渲染机制过于复杂，所以渲染模块在执行过程中会被划分成很多子阶段，输入的HTML经过这些子阶段后，最终输出像素。这样的一个处理流程叫做<strong>渲染流水线</strong>。</p><p>按照渲染的时间顺序，流水线可被划分为如下几个子阶段：构建DOM树、样式计算、布局阶段、分层、绘制、分块、光栅化和合成。</p><h2 id="构建dom树" tabindex="-1">构建DOM树 <a class="header-anchor" href="#构建dom树" aria-label="Permalink to &quot;构建DOM树&quot;">​</a></h2><p><strong>由于浏览器无法直接理解和使用HTML，所以需要将HTML转换成浏览器能够理解的结构-DOM树</strong>。这个跟描述程序语法结构的ast（抽象语法树）类似。可以在控制台中输入“document”后回车，查看DOM结构。</p><h2 id="样式计算-recalculate-style" tabindex="-1">样式计算（Recalculate Style） <a class="header-anchor" href="#样式计算-recalculate-style" aria-label="Permalink to &quot;样式计算（Recalculate Style）&quot;">​</a></h2><p>通过样式计算，计算出DOM节点中每个元素的样式。这个阶段可分为三步：</p><ol><li>把CSS转换为浏览器能够理解的结构</li></ol><p>CSS样式来源主要有三种：</p><ul><li>通过link引用的外部CSS文件</li><li>style标签内的CSS</li><li>行内样式，元素style属性内嵌的CSS</li></ul><p>和HTML一样，浏览器也是无法理解这些CSS文本，所以<strong>当渲染引擎接收到CSS文本时，会执行一次转换操作，将CSS文本转换为浏览器可以理解的结构——styleSheets。</strong> 可以在控制台输入document.styleSheets查看其结构。</p><p>styleSheets包括了三种来源的CSS，并提供了查询和修改的功能。</p><ol start="2"><li>转换样式表中的属性值，使其标准化</li></ol><p>CSS中有些属性值是为了方便开发人员而设计的，但渲染引擎并不容易理解。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">blue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  font-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">rem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  font-weight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">bold</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>经过转化后的结果为：</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">rgb</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">255</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  font-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  font-weight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">700</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ol start="3"><li>计算出DOM树种每个节点的具体样式。</li></ol><p><strong>这就设计到CSS的继承规则和层叠规则了。</strong></p><p>CSS继承是指每个DOM节点都包含有父节点的样式。需要注意的是，<strong>浏览器有一组UserAgent的默认样式，如果你不提供样式，默认会使用它。</strong></p><h2 id="布局阶段" tabindex="-1">布局阶段 <a class="header-anchor" href="#布局阶段" aria-label="Permalink to &quot;布局阶段&quot;">​</a></h2><p>布局：计算DOM树中可见元素的几何位置的过程叫做布局。Chrome在布局阶段需要完成两个任务：创建布局树和布局计算。</p><ol><li>创建布局树</li></ol><p>DOM树中会包含一些不可见的元素，比如head标签，还有使用了display:none属性的元素，所以<strong>在显示之前，我们还要额外地构建一颗只包含可见元素的布局树。</strong></p><p>创建布局树过程：</p><ul><li>遍历DOM树中的所有可见节点，并把这些节点加到布局树中；</li><li>不可见的节点会被布局树忽略掉，如head标签下面的全部内容和包含display:none属性的元素。</li></ul><ol start="2"><li>布局计算</li></ol><p>有了一棵完整的布局树之后，接下来就要计算布局树节点的坐标位置了。</p><h2 id="分层" tabindex="-1">分层 <a class="header-anchor" href="#分层" aria-label="Permalink to &quot;分层&quot;">​</a></h2><p>生成布局树，并计算出每个元素的具体位置之后，是不是就要着手绘制页面了？</p><p>答案是否定的。</p><p>因为页面中有很多复杂的效果，如一些复杂的3D变换、页面滚动、或者使用z-indexing做z轴排序等，为了更加方便地实现这些效果，<strong>渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）。</strong> 正是这些图层叠加在一起构成了最终的页面图像。</p><p>可以通过Chrome开发者工具，选择“Layers”标签，就可以可视化页面的分层情况。</p><p>通常情况下，<strong>并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的图层，那么这个节点就从属于父节点的图层。</strong> 但不管怎样，最终每一个节点都会直接或者间接地从属于同一个层。</p><p>满足以下任意一条，渲染引擎会为这个节点创建一个单独的图层：</p><ul><li>拥有层叠上下文属性的元素会被提升到单独的一层，比如明确定位的元素（position），定义透明的元素（opacity），使用CSS滤镜的元素（filter）等，都拥有层叠上下文。</li><li>需要<strong>剪裁（clip）</strong> 的地方也会创建图层</li></ul><p>剪裁：如果一个固定大小的容器里面的内容超出了容器大小，就需要裁减只展示内容的一部分。如果出现滚动条，滚动条也会被提升为单独的层。</p><h2 id="图层绘制" tabindex="-1">图层绘制 <a class="header-anchor" href="#图层绘制" aria-label="Permalink to &quot;图层绘制&quot;">​</a></h2><p>构建图层树之后，渲染引擎会对图层树中的每个图层进行绘制。</p><p>渲染引擎会把一个图层的绘制拆分成很多小的<strong>绘制指令</strong>，然后再把这些指令按照顺序组成一个待绘制列表。每个元素的背景、前景、边框都需要单独的指令去绘制。</p><h2 id="栅格化-raster-操作" tabindex="-1">栅格化（raster）操作 <a class="header-anchor" href="#栅格化-raster-操作" aria-label="Permalink to &quot;栅格化（raster）操作&quot;">​</a></h2><p>绘制列表只是用来记录绘制顺序和绘制指令的列表，而实际上绘制操作是由渲染引擎中的合成线程来完成的。当图层的绘制列表准备好之后，主线程会把该绘制列表<strong>提交（commit）</strong> 给合成线程。</p><p>合成线程是如何工作的？</p><p><strong>视口：</strong> 通常一个页面可能很大，但用户只能看到其中一部分，我们把用户可以看到的这个部分叫做视口。</p><p>有时候图层可能较大，但用户只能看到视口那一部分，所以没必要一次性将所有图层全部绘制。</p><p>基于这个原因，<strong>合成线程会将图层划分为图块（tile），</strong> 这些图块通常是256x256或者512x512，然后<strong>合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图。</strong> 而图块是栅格化执行的最小单位。渲染进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的。</p><p>通常，栅格化过程都会使用GPU来加速生成，使用GPU生成位图的过程叫做快速栅格化或者GPU栅格化，生成的位图被保存在GPU内存中。</p><h2 id="合成和显示" tabindex="-1">合成和显示 <a class="header-anchor" href="#合成和显示" aria-label="Permalink to &quot;合成和显示&quot;">​</a></h2><p>一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——“DrawQuad”，然后把该命令提交给浏览器进程。</p><p>浏览器进程里面有一个组件viz，它会接收合成线程发过来的DrawQuad命令，然后根据这条命令，将其页面内容绘制到内存中，最后再将内存显示到屏幕上。</p><p>到这里，经过这一系列的阶段，编写好的HTML、CSS、JavaScript等文件，经过浏览器就会显示出漂亮的页面了。</p><h2 id="渲染流程总结" tabindex="-1">渲染流程总结 <a class="header-anchor" href="#渲染流程总结" aria-label="Permalink to &quot;渲染流程总结&quot;">​</a></h2><p>一个完整的渲染流程可大致总结如下：</p><ol><li>渲染进程将HTML转化为<strong>DOM树</strong></li><li>渲染引擎将CSS样式转化为<strong>styleSheets</strong>，计算出每个DOM节点的样式。</li><li>创建<strong>布局树</strong>，并计算元素的布局信息。</li><li>对布局树进程分层，并生成<strong>分层树</strong>。</li><li>为每个图层生成<strong>绘制列表</strong>，并将其提交到合成线程。</li><li>合成线程将图层分成<strong>图块</strong>，并在<strong>光栅化线程池</strong>中将图块转换成位图。</li><li>合成线程发送绘制图块命令<strong>DrawQuad</strong>给浏览器进程。</li><li>浏览器进程根据DrawQuad消息<strong>生成页面</strong>，并显示到显示器上。</li></ol>`,54)]))}const c=i(n,[["render",e]]);export{g as __pageData,c as default};
