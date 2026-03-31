## 参考
"基于Claude Code搭建了从需求拆解、编码、测试到Code Review的AI辅助工作流，团队整体交付效率提升100%”

再加几个和 AI 相关的技能就可以，比如说：
1. 使用 Skill 提升你们的测试覆盖率
2. 进行 v2 到 v3 的一个升级
3. 进行 code review


Code review 可以往前边写一些，然后再写一些掌握的 AI 技能。

比如：
1. Skills
2. Agents.md
3. 如何正确并且高效地创建 plan

把这些都写在技能里边


前端有一些工具函数（比如日期函数，还有像 Lodash 那样的一些工具函数），这些都可以做很好的单测，而且覆盖率要求会比较高，基本上每个都要覆盖到。

然后是组件测试。这种测试主要是针对 Vue 组件，看它是否正确渲染、每个分支是否覆盖。这部分目前写得比较少。

还有一个是端对端（E2E）测试，可以针对重点逻辑和重点流程来做。

我觉得测试重点应该是“抓两头”：
1. 工具函数：需要全部覆盖
2. 端对端测试：覆盖重要流程

对于中间的那些组件，我觉得能写就写吧。

面试的时候就看你怎么说，你也可以说：你在早期先把它（项目）的工具函数以及所有的重要流程都做了端到端测试，然后再重构成 Vue3；发现所有端到端测试都通过后，再手动测试一下其他组件和页面，接着交给测试或者其他同事去测一下。没有问题的话，最后就验收通过。

面试官有可能会对这个环节提问，你可以找一个小项目提前做下准备。

## AI 简历描述

你是一名资深的前端工程师，现在我在日常开发中用ai做了以下几件事，要求你把它用合适的语言整理出来，可以直接放在简历上成为亮点：
1. 使用 Opus 4.6 做需求规划，利用头脑风暴（Brainstorm） skill 进行需求规划，该技能会逐条确认需求细节，生成一部分确认一部分，从而大幅提升生成内容与需求的匹配度
2. 使用做 GPT 5.4 辅助编码, 使用 vue 相关 skill 实现 vue 最佳实践
3. 使用 vercel-labs/skills 做 skills 管理
4. 使用 `AGENT.md` 明确项目的启动、打包流程及内部组件库文档路径，确保 AI 能准确读取项目上下文，AGENTS.md 包含以下内容：
  - 项目注意点
  - 内部库的文档
  - 项目安装流程
  - 运行流程
  - 打包流程
5. 内部库文档打包：借鉴 Next.js 的做法，建议将组件库文档打包进 `dist/docs` 目录，并在 `agent.md` 中指引 AI 读取，避免 AI 使用过期 API。
6. 接入 CodeRabbit 到 gitlab 中进行 Code Review，自动审查 PR 并提供修复提示词。

## 需求规划
- 头脑风暴（Brainstorm） skill：https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md


## skills 管理

https://github.com/vercel-labs/skills

- 全局级 Skill: `~/.agents/skills`
- 项目级 Skill: 每个项目根目录下

使用 `skills` 命令行工具（类似 pnpm）管理 Skill，支持全局安装（如 Vue 最佳实践）与项目级安装（如文档同步），避免重复下载。

- hyf0/vue-skills@vue-testing-best-practices：vue 单元测试
- antfu/skills
- Brainstorm Skill

## Agent 配置

Agent 配置文件规范：建议在项目中配置 `agent.md`，明确项目的启动、打包流程及内部组件库文档路径，确保 AI 能准确读取项目上下文。


AGENTS.md 内容：
- 项目注意点
- 内部库的文档
- 项目安装流程
- 运行流程
- 打包流程


内部库文档打包：借鉴 Next.js 的做法，建议将组件库文档打包进 `dist/docs` 目录，并在 `agent.md` 中指引 AI 读取，避免 AI 使用过期 API。


二、高级概念与技术栈探讨
1. Harness 工程与自动化
Harness Engineering（工程）：这是一种让 AI 接管整个开发流程的模式，通过多 Agent 协作（如 GPT-4 调研 + GPT-5 编码）和自动化测试，实现长达数小时的无人值守开发。
成本与门槛：该模式极度消耗 Token（约 $100-$200/天），且需顶级模型支持，目前主要在开源社区验证，个人实践成本过高。
模型选型策略：讨论了不同模型的适用场景，建议复杂规划使用 Claude Sonnet 或 GPT-4，编码实现使用 GPT-5 或 Claude Haiku，以平衡成本与效果。
2. 代码审查与 CI/CD 集成
Code Review 工具推荐：CodeRabbit 工具能集成到 GitLab，自动审查 PR 并提供修复提示词，可以研究下如何在私有化部署的 GitLab 中配置。
<!-- CI/CD 流程整合：将 AI 代码审查作为独立 Job 集成到现有 CI/CD 流程（如 GitLab CI）中的可能性，需进一步研究具体配置方式。 -->

CodeRabbit: https://www.coderabbit.ai/
各个模型特点：https://ampcode.com/models

## code review 

提示词给cursor

## 和AI的一种新协作方式 Harness engineering
- skill 统筹/编排器

使用顶级模型

- GPT 5.4：调研
- Opus 4.6: 任务不太清楚，
- sonnet 4.6

顶级模型做规划
高级模型做编码
