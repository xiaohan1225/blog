import{_ as e,c as t,o as s,ae as i}from"./chunks/framework.CLNW5JS9.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/typescript/class.md","filePath":"collect/typescript/class.md"}'),l={name:"collect/typescript/class.md"};function r(c,a,o,p,n,d){return s(),t("div",null,a[0]||(a[0]=[i(`<h2 id="class的基本用法、继承、类型约束、implements" tabindex="-1">class的基本用法、继承、类型约束、implements <a class="header-anchor" href="#class的基本用法、继承、类型约束、implements" aria-label="Permalink to &quot;class的基本用法、继承、类型约束、implements&quot;">​</a></h2><h2 id="class的修饰符-readonly-private-protected-public" tabindex="-1">class的修饰符 readonly private protected public <a class="header-anchor" href="#class的修饰符-readonly-private-protected-public" aria-label="Permalink to &quot;class的修饰符 readonly private protected public&quot;">​</a></h2><ul><li>private: 只能在当前类内部使用</li><li>protected: 只能在当前类内部和子类中使用</li><li>public(默认): 可以在当前类和子类中使用，也可以在实例中使用</li><li>readonly: 只读属性，只能在声明时或构造函数中赋值</li></ul><h2 id="super" tabindex="-1">super <a class="header-anchor" href="#super" aria-label="Permalink to &quot;super&quot;">​</a></h2><p><code>super</code>代表父类，先有父后有字，所以需要在子类的构造函数中调用<code>super</code>，且必须写在第一行。</p><p>可以理解成<code>父类的prototype.constructor.call</code></p><h2 id="static" tabindex="-1">static <a class="header-anchor" href="#static" aria-label="Permalink to &quot;static&quot;">​</a></h2><p>可以使用<code>static</code>修饰属性和方法，静态属性和方法只能通过类名来调用，不能通过实例来调用。</p><h2 id="get-set" tabindex="-1">get set <a class="header-anchor" href="#get-set" aria-label="Permalink to &quot;get set&quot;">​</a></h2><h2 id="类使用泛型" tabindex="-1">类使用泛型 <a class="header-anchor" href="#类使用泛型" aria-label="Permalink to &quot;类使用泛型&quot;">​</a></h2><h2 id="抽象类" tabindex="-1">抽象类 <a class="header-anchor" href="#抽象类" aria-label="Permalink to &quot;抽象类&quot;">​</a></h2><p>不能被实例化，abstract修饰的方法不能实现，使用子类继承抽象类，需要实现抽象类定义的抽象方法。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Animal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,13)]))}const k=e(l,[["render",r]]);export{u as __pageData,k as default};
