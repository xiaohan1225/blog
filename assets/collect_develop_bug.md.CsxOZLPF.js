import{_ as l,C as d,c as p,o as h,ae as a,j as i,G as o,w as t,a as n}from"./chunks/framework.CLNW5JS9.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/develop/bug.md","filePath":"collect/develop/bug.md"}'),r={name:"collect/develop/bug.md"};function k(c,e,u,E,f,g){const s=d("font");return h(),p("div",null,[e[2]||(e[2]=a(`<h2 id="重复点击问题" tabindex="-1">重复点击问题 <a class="header-anchor" href="#重复点击问题" aria-label="Permalink to &quot;重复点击问题&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onClick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">query</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.$route;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  query.a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.$router.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">push</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;home&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, query });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>如果用户点击了两次，<code>onClick</code>事件会执行两次，两次取的<code>query</code>会不一样，第二次取的<code>query</code>是第一次<code>onClick</code>触发时，调用<code>$router.push</code>传入的<code>query</code>。</p><h2 id="dom-diff-报错" tabindex="-1">dom diff 报错 <a class="header-anchor" href="#dom-diff-报错" aria-label="Permalink to &quot;dom diff 报错&quot;">​</a></h2><p>bug产生：先进入课时播放页，然后判断用户没买这个们课程，然后跳转到购买页，页面报错，用户在页面上点击购买按钮无反应，影响了学员正常购课。</p><p>报错原因：</p><ul><li>我们系统中有两个弹窗，一个是插屏元素，一个是【正在直播】弹窗，两个弹框是邻近的兄弟节点关系，先访问页面A，显示插屏元素，然后访问页面B，也需要显示插屏元素，而此时【正在直播】弹窗已经被挂在到body下面，Vue在进行insertBefore时找不到参考元素，报错。</li></ul><p>报错信息：</p>`,8)),i("ul",null,[i("li",null,[o(s,{color:"red"},{default:t(()=>e[0]||(e[0]=[n(`[Vue warn]: Error in nextTick: "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."`)])),_:1})]),i("li",null,[o(s,{color:"red"},{default:t(()=>e[1]||(e[1]=[n("DOMException: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.")])),_:1})])]),e[3]||(e[3]=a("<p>报错条件：</p><ol><li>一个元素下面是一个弹窗，而弹窗被挂载到body下面，两个元素都用v-if控制</li><li>元素和弹窗需要同时重新渲染，在页面跳转时，元素的v-if为false，本来弹框的v-if应该也为false的，假设控制元素的变量是a，控制弹框的元素是b，b是个计算属性，不仅依赖a还依赖了c，但此时由于代码先后顺序的原因，由于只收集到了c的依赖没收集到a的依赖，所以当a改为false时，弹框的v-if还是为true，当页面请求结束后，此时该元素和弹框的v-if都为true。</li></ol><p>oldVnode： Aside组件 comment注释节点 dialog组件 open-app组件 newVnode：Aside组件 插屏弹框组件 comment注释节点 open-app组件</p><p>排查过程：</p><ol><li>利用 <code>vscode</code> 的调试能力，断点调试vue项目</li><li>排查到是 <code>dom diff</code> 那里报错了。</li></ol><p>收获点：</p><ol><li>更加熟悉了 <code>dom diff</code>原理，学习原理得到了正反馈，进而去学习了 <code>vue3</code> 整个的源码。</li><li><code>debugger</code>能力，学会了如何在项目中调试<code>vue</code>源码。</li></ol>",7))])}const m=l(r,[["render",k]]);export{_ as __pageData,m as default};
