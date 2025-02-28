import{_ as e,c as t,o as l,ae as i}from"./chunks/framework.BHrE6nLq.js";const p=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/javascript/单元测试.md","filePath":"collect/javascript/单元测试.md"}'),r={name:"collect/javascript/单元测试.md"};function o(c,a,s,n,_,d){return l(),t("div",null,a[0]||(a[0]=[i('<h2 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-label="Permalink to &quot;单元测试&quot;">​</a></h2><h3 id="重要性" tabindex="-1">重要性 <a class="header-anchor" href="#重要性" aria-label="Permalink to &quot;重要性&quot;">​</a></h3><ol><li>保证研发质量</li><li>提高项目稳定性 自以为改动一个很小的地方，不会影响其它地方，然后就发布上线了，这就意味着发新版本以后让用户来帮你做测试，每次版本更新后，都有可能带来一个未知的bug，这是很可怕的。</li><li>提高开发速度 短期会拖累开发速度，但长期来看，有了单元测试，后续迭代需求，每次commit代码时都可以跑一遍单测，如果有问题可以及时发现更改，防止等待版本快要上线时或者已经上线之后才发现。</li></ol><h3 id="哪些地方需要写单元测试" tabindex="-1">哪些地方需要写单元测试 <a class="header-anchor" href="#哪些地方需要写单元测试" aria-label="Permalink to &quot;哪些地方需要写单元测试&quot;">​</a></h3><p>业务开发的话，可以选择性写代码测试，对工具类的函数库，通用类的组件等写单元测试，而开源的话，单测要覆盖到几乎所有代码。</p><h3 id="使用方式" tabindex="-1">使用方式 <a class="header-anchor" href="#使用方式" aria-label="Permalink to &quot;使用方式&quot;">​</a></h3><ul><li>jest或mocha</li><li>@vue/test-utils</li><li>sinon</li></ul><p>describe: 测试集 第一个参数是名称，第二个参数是一个方法，里面写单元测试 每一个it 是单测的最小集</p>',8)]))}const u=e(r,[["render",o]]);export{p as __pageData,u as default};
