import{_ as a,c as o,o as i,ae as t}from"./chunks/framework.CDwmhxVj.js";const l="/blog/assets/vue3%E5%8C%85%E6%9E%84%E6%88%90.BwzCR3c1.png",f=JSON.parse('{"title":"001 Vue3的升级点","description":"","frontmatter":{"title":"001 Vue3的升级点","date":"2022-06-03T00:00:00.000Z","categories":["Vue"],"tags":["Vue3.0"],"sidebar":"auto"},"headers":[],"relativePath":"collect/framework/vue/vue3/001.md","filePath":"collect/framework/vue/vue3/001.md"}'),r={name:"collect/framework/vue/vue3/001.md"};function c(n,e,s,d,p,h){return i(),o("div",null,e[0]||(e[0]=[t('<h2 id="vue3架构" tabindex="-1">vue3架构 <a class="header-anchor" href="#vue3架构" aria-label="Permalink to &quot;vue3架构&quot;">​</a></h2><p>Vue3源码采用<strong>monorepo</strong>方式进行管理，将模块拆分到packages中，这样做的好处如下：</p><ol><li>将多个模块集合到一个仓库，方便维护</li><li>方便版本管理和依赖管理，各模块间相互引用也比较方便</li><li>各个包可以单独安装使用，不需要导入整个vue</li></ol><p><img src="'+l+'" alt="图片加载失败"></p><h2 id="composition-api" tabindex="-1">Composition API <a class="header-anchor" href="#composition-api" aria-label="Permalink to &quot;Composition API&quot;">​</a></h2><p>vue2中<code>Options API</code>（即提供props、methods、data、computed、watch等属性供用户使用）的问题：</p><ol><li>复用性比较差，虽然提供mixins和extends，但会出现数据来源不明确和重名问题</li><li>需要使用带有副作用<code>this</code>，存在this指向问题，同时对tree-shaking也不友好</li></ol><p>vue3<code>Composition API</code>特点：</p><ol><li>方便抽离，复用性强</li><li>抛弃this，tree-shaking友好，打包出来体积更小</li></ol><h2 id="响应式系统" tabindex="-1">响应式系统 <a class="header-anchor" href="#响应式系统" aria-label="Permalink to &quot;响应式系统&quot;">​</a></h2><p>vue3采用<code>proxy</code>替代了<code>Object.defineProperty</code>:</p><ol><li>提升了性能，不再需要一次性全部递归拦截</li><li>能拦截到对象属性的新增和删除</li><li>能拦截原生数组的索引、length操作</li></ol><h2 id="diff算法" tabindex="-1">diff算法 <a class="header-anchor" href="#diff算法" aria-label="Permalink to &quot;diff算法&quot;">​</a></h2><p>vue3采用<strong>快速diff</strong>（内部采用了一个最长递增子序列的算法）替换了vue2的<strong>双端diff</strong>，优化了diff效率。</p><h2 id="渲染优化" tabindex="-1">渲染优化 <a class="header-anchor" href="#渲染优化" aria-label="Permalink to &quot;渲染优化&quot;">​</a></h2><p>在渲染方面，vue3提供了<strong>自定义渲染器</strong>，大大提升了扩展能力。</p><h2 id="编译优化" tabindex="-1">编译优化 <a class="header-anchor" href="#编译优化" aria-label="Permalink to &quot;编译优化&quot;">​</a></h2><ul><li>Block和patchFlag：为动态节点打上补丁标志，即patchFlag，同时还提出了block的概念，block本质上是一个虚拟节点，但它会多出一个dynamicChildren数组，会收集它所有的动态子代节点，比对的时候会忽略DOM层级结构的，所以对于带有v-if、v-for等结构化指令的节点也作为block的角色。</li><li>静态提升：将静态虚拟的节点提升到render函数之外，这样能够减少更新时创建虚拟DOM带来的性能开销和内存占用。</li><li>预字符串化：在静态提升的基础上，当模板中包含大量连续纯静态的标签节点时，将这样静态节点序列化成字符串，然后通过innerHTML进行设置，这样做能够减少创建虚拟节点产生的性能开销和内存占用。</li><li>缓存内联事件处理函数：可以避免不必要的更新</li><li>v-once指令：缓存虚拟节点，避免组件更新时重新创建虚拟DOM的性能开销，同时带有v-once指令的节点不会被父级block收集，所以不会参与diff操作，避免无用的diff开销。</li></ul><h2 id="新增组件" tabindex="-1">新增组件 <a class="header-anchor" href="#新增组件" aria-label="Permalink to &quot;新增组件&quot;">​</a></h2><ul><li>Teleport：可以将指定内容渲染到特定容器中，而不受DOM层级的限制。</li></ul><h2 id="对typescript支持更加友好" tabindex="-1">对TypeScript支持更加友好 <a class="header-anchor" href="#对typescript支持更加友好" aria-label="Permalink to &quot;对TypeScript支持更加友好&quot;">​</a></h2><p>vue2源码采用Flow做类型检测，对TypeScript支持并不友好，而Vue3采用TypeScript进行重写，对TS的支持更加友好。</p>',22)]))}const m=a(r,[["render",c]]);export{f as __pageData,m as default};
