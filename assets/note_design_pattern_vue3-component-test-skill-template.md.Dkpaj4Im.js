import{_ as i,o as a,c as n,ae as l}from"./chunks/framework.B2m0-DLt.js";const g=JSON.parse('{"title":"Vue3 Component Test Skill Template","description":"","frontmatter":{},"headers":[],"relativePath":"note/design_pattern/vue3-component-test-skill-template.md","filePath":"note/design_pattern/vue3-component-test-skill-template.md"}'),p={name:"note/design_pattern/vue3-component-test-skill-template.md"};function h(k,s,t,e,E,d){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="vue3-component-test-skill-template" tabindex="-1">Vue3 Component Test Skill Template <a class="header-anchor" href="#vue3-component-test-skill-template" aria-label="Permalink to &quot;Vue3 Component Test Skill Template&quot;">​</a></h1><p>下面是一版适合 <code>Vue3 + TypeScript + Vitest</code> 的最小可用 Skill 模板。</p><p>你可以把它保存到你自己的 Skill 目录，例如：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vue3-component-test/</span></span>
<span class="line"><span>└── SKILL.md</span></span></code></pre></div><hr><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: vue3-component-test</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">description: 为 Vue3 + TypeScript 项目编写和补全组件单元测试。适用于使用 Vitest、@vue/test-utils、Testing Library 的前端项目，帮助分析组件行为、设计测试点、生成测试代码、补齐边界场景并提升测试覆盖率。</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># Vue3 Component Test</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">在用户要求为 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`Vue3 + TypeScript\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 项目编写、补全、优化组件单元测试，或要求提升组件测试覆盖率时使用本 Skill。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 目标</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">围绕组件的用户可见行为和核心业务逻辑编写稳定、可维护的测试，而不是为了覆盖率机械断言实现细节。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 默认技术栈</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 测试框架：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`Vitest\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 组件测试：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`@vue/test-utils\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 行为测试：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`@testing-library/vue\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">（如果项目已使用）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Mock：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`vi.mock\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、项目内 test-utils、已有 fixtures</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如果仓库中的实际技术栈不同，优先遵循项目现状。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 工作流程</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 先查看项目现状：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`package.json\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`vitest.config.*\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 现有测试目录和命名风格</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 组件依赖的 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`router\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`pinia\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`i18n\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、请求层 mock 方案</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 在写测试前，总结目标组件的：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 输入：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`props\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 输出：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`emits\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 关键分支：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`computed\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`watch\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、条件渲染、禁用态、异常态</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 副作用：请求、路由跳转、状态更新、定时器</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 优先覆盖高价值场景：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 正常渲染</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 关键交互</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 边界输入</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 异步状态变化</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 错误或空态</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 生成测试时优先复用项目已有工具，不新增不必要的测试基础设施。</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">5.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 完成后运行相关测试；如果失败，基于报错继续修复。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 编写原则</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 1. 优先测试行为，不迷恋实现细节</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">优先断言：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 页面上显示了什么</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户交互后发生了什么</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否触发了正确的事件、回调或状态变化</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">谨慎断言：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 内部私有方法调用次数</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 非用户可感知的中间变量</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 过度依赖组件内部结构的选择器</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 2. 优先使用稳定选择器</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如果项目已有约定，优先使用：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`data-test\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 可访问性查询</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 语义明确的文本</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">不要过度依赖容易变化的 class 名或深层 DOM 结构。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 3. 保持测试颗粒度适中</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">一个测试文件应围绕一个组件的核心职责展开。不要在一个 case 中覆盖过多分支。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 4. Mock 只 Mock 边界，不 Mock 业务本身</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">优先 mock：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> API 请求</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 路由</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 时间</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 浏览器环境能力</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 外部依赖</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">尽量不要把组件内部核心逻辑全部 mock 掉，否则测试没有价值。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 组件测试清单</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">为组件设计测试时，优先检查以下项目：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否正确渲染默认内容</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否根据 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`props\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 渲染不同状态</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否正确响应点击、输入、切换、提交等交互</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否正确触发 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`emit\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否处理 loading、empty、error、disabled 等状态</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否在异步完成后更新 UI</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否调用依赖的 store、router、API 或 composable</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 常见场景模板</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### Props 渲染</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">至少考虑：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 默认 props</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 关键 props 变化</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 非法或边界输入</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### Emits</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">至少考虑：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 交互后是否触发事件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 事件参数是否正确</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 异步逻辑</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">至少考虑：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 请求开始时的 loading</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 请求成功后的结果展示</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 请求失败后的错误提示</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">必要时使用：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`await flushPromises()\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`await nextTick()\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 条件渲染</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">至少考虑：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 有数据</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 无数据</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 权限不足</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 禁用状态</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 输出要求</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">完成任务时，输出应包含：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 修改了哪些测试文件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 新增了哪些测试点</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 是否复用了现有 test-utils 或 mock</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 测试是否通过</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">5.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 仍然未覆盖的风险点</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 限制</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不要为了提覆盖率强行给纯展示、无业务价值的细节写脆弱测试</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不要无依据引入新的测试库</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不要擅自重构生产代码，除非测试落地必须且改动很小</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不要忽略项目既有测试风格</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 接到任务后的推荐执行方式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如果用户只说“给这个组件补测试”，按以下顺序进行：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 阅读组件源码和相邻测试</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 总结组件职责和关键分支</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 列出建议补充的测试点</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 直接实现测试</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">5.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 运行相关测试并修复</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 推荐提示词</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">当用户没有给出足够细节时，可按下面的目标执行：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">“请基于当前项目已有测试风格，为这个 Vue3 + TypeScript 组件补充单元测试。优先覆盖核心交互、状态切换、事件触发、异常和边界场景，尽量复用已有 test-utils / mocks，并在完成后运行相关测试验证结果。”</span></span></code></pre></div><hr><h2 id="可选增强" tabindex="-1">可选增强 <a class="header-anchor" href="#可选增强" aria-label="Permalink to &quot;可选增强&quot;">​</a></h2><p>如果你准备长期使用这个 Skill，建议后续再补这几类内容：</p><ul><li><code>references/vue-test-conventions.md</code><ul><li>记录你们项目自己的测试规范</li></ul></li><li><code>references/mock-rules.md</code><ul><li>记录接口、路由、Pinia 的 mock 方式</li></ul></li><li><code>assets/component-test-example.spec.ts</code><ul><li>放一份你最满意的组件测试样例</li></ul></li></ul><p>这样 AI 后面写出来的测试会更贴近你们团队风格。</p>`,11)])])}const c=i(p,[["render",h]]);export{g as __pageData,c as default};
