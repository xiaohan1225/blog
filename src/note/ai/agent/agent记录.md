## 思维链与推理循环 (ReAct)

场景：用户问“帮我查一下特斯拉最近的股价，然后计算如果我在一个月前买入 1000 美元，现在赚了多少？”

一个没有经过训练的模型可能会：

直接瞎编一个股价（幻觉）。
或者只查股价，忘记做计算。
我们需要教它分步思考。这就是 ReAct (Reasoning + Acting) 模式。也就是 Reasoning（想）+ Acting（做），加上 Observation（看结果）。

ReAct 的核心流程：
- Thought（思考）：模型先自言自语：“我需要先查特斯拉当前股价，再查一个月前的股价，然后计算收益率。”
- Action（行动）：调用工具 getStockPrice('TSLA', 'now')。
- Observation（观察）：获得结果 $250。
- Thought（再思考）：“好的，现在我需要查一个月前的价格。”
- Action（再行动）：调用工具 getStockPrice('TSLA', '1 month ago')。
- Observation（再观察）：获得结果 $200。
- Final Answer（最终回答）：“一个月前股价200，现在200，现在250，你赚了 25%。”
关键点：每一步的 Thought 都会被添加到 messages 历史中，成为下一步推理的上下文。

### 如何引导 ReAct？
为了让模型更好地遵循 ReAct 模式，我们通常在 System Prompt 中加入明确的指令：

```
你是一个智能助手。在回答问题前，请始终遵循以下步骤：
1. 先思考（Thought）：分析用户需要什么信息，是否需要调用工具。
2. 如果需要工具，调用它（Action），然后等待结果（Observation）。
3. 根据结果再次思考，直到你有足够的信息回答用户。
4. 最后给出最终答案（Final Answer）。

不要跳过任何步骤。如果不确定，请先查询再回答。
```

## 如何验证模型是否真的遵循了 ReAct 流程？

解析消息历史，断言每次工具调用前都有 Thought 标记。

这正是前端思维在 AI 开发中的绝佳应用：“断言（Assertion）” 和 “日志验证”。

可以写一个辅助函数，在每次模型返回后，自动检查 messages 历史：

```js
function validateReActFlow(messages) {
  // 检查每个 tool_call 前面是否都有 thought 标记
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === 'assistant' && messages[i].tool_calls) {
      // 检查前一条消息是否包含思考过程
      const prev = messages[i-1]?.content;
      if (!prev || !prev.includes('Thought:')) {
        throw new Error('ReAct 违规：模型未思考就直接调用工具！');
      }
    }
  }
}
```
这就像是在 CI/CD 流水线里加了一个自动化测试，确保模型的每一次“行动”都有“思考”作为前置条件。如果验证失败，你可以立即报警，或者强制让模型重新生成。

ReAct 的本质：将“思考 - 行动 - 观察”显式化，避免模型瞎编。

## 记忆系统与知识检索 (Memory & RAG)
现在的 Agent 已经很能干了，但它有一个致命弱点：健忘。

一旦对话结束，或者 messages 数组超过了 Token 限制（比如 128k），它就会忘记之前说过什么。

场景：

用户：“我昨天让你帮我写的 Python 脚本，还能再发我一次吗？”
Agent：“抱歉，我不记得了。”（因为昨天的对话不在当前的 messages 里）
我们需要给 Agent 加上长期记忆。这就引入了两个概念：

- Conversation Memory（对话记忆）：存储历史对话，按需加载。
- RAG (Retrieval-Augmented Generation，检索增强生成)：存储外部知识（如公司文档、产品手册），在回答时动态检索。

RAG 的工作流程：
- 索引（Indexing）：把你的文档切分成小块（Chunks），转换成向量（Embeddings），存入向量数据库（如 Pinecone, Chroma）。
- 检索（Retrieval）：用户提问时，先把问题转换成向量，去数据库里搜索最相似的文档片段。
- 增强（Augmentation）：把搜到的文档片段塞进 messages 里，告诉模型：“这是背景资料，请基于此回答。”
- 生成（Generation）：模型结合背景资料和用户问题，给出准确答案。

### 实战：如何在 JS/TS 中实现 RAG？
以 Vercel AI SDK 为例，你可以这样写：

```js
import { tool } from 'ai';
import { z } from 'zod';

// 定义一个检索工具
const retrieveTool = tool({
  description: '从知识库中检索相关文档',
  parameters: z.object({
    query: z.string().describe('用户问题的关键词')
  }),
  execute: async ({ query }) => {
    // 1. 将问题转换成向量
    const embedding = await embed(query);
    // 2. 在向量数据库中搜索最相似的文档
    const docs = await vectorStore.search(embedding, { topK: 3 });
    // 3. 返回文档内容给模型
    return docs.map(d => d.content).join('\n');
  }
});

// 在对话中使用
const result = await generateText({
  model,
  messages,
  tools: [retrieveTool] // 把检索工具交给模型
});
```

RAG 本质上就是一个特殊的 Tool Calling！
- 模型决定何时调用这个工具（当它发现自己缺乏相关知识时）。
- 你执行检索逻辑，返回文档片段。
- 模型结合文档片段回答问题

### 进阶：对话记忆的管理策略

除了 RAG，我们还需要管理历史对话。但 messages 数组会越来越大，怎么办？

常见的策略有：
- 滑动窗口（Sliding Window）：只保留最近的 N 轮对话（如最近 10 条），更早的丢弃。
- 摘要压缩（Summarization）：定期调用模型把旧对话总结成一段简短的摘要，替换掉原始记录。
- 关键信息提取：从历史对话中提取用户偏好、待办事项等关键信息，存入结构化数据库，需要时再检索。

在法律、医疗、编程等长上下文依赖的场景中，"滑动窗口"策略是危险的。用户三天前提到的某个关键条款，可能是今天问题的核心依据。如果忘记了，Agent 可能会：
- 给出自相矛盾的建议。
- 遗漏重要约束条件。
- 甚至违反之前达成的共识。
这就是为什么高级的 Memory 系统需要结合多种策略：
- 短期记忆：用滑动窗口保留最近对话。
- 长期记忆：用向量数据库存储所有历史，需要时检索（RAG 的思路）。
- 结构化记忆：提取用户偏好、任务状态等存入传统数据库。

记忆系统与知识检索 (Memory & RAG)核心内容：
- RAG 的本质：基于向量语义搜索的"外部大脑"，而非简单缓存。
- RAG 与 Tool Calling 的关系：RAG 本身就是一个特殊的工具调用。
- Token 经济性：为什么必须先检索再增强，而不是暴力塞入所有文档。
- 记忆管理策略：滑动窗口的局限性，以及混合记忆系统的必要性。

## 多智能体协作系统 (Multi-Agent Systems)

场景：
用户："帮我开发一个完整的电商网站，包括前端、后端、数据库设计、部署脚本，还要写测试用例。"

一个 Agent 要同时扮演：

前端专家（React/Vue）
后端专家（Node.js/Python）
数据库专家（SQL/NoSQL）
DevOps 专家（Docker/K8s）
测试专家（Jest/Cypress）
这会导致：

注意力分散：模型在不同角色间切换，容易混淆。
专业度下降：通才不如专才。
Token 爆炸：System Prompt 太长，上下文不够用。

解决方案是：多智能体协作（Multi-Agent）。

架构模式：

Manager Agent：负责拆解任务、分配工作、整合结果。
Worker Agents：每个专注于一个领域（前端、后端、测试等）。
Communication Protocol：Agent 之间如何传递消息（通常通过共享的消息队列或数据库）。
类比：
这就像前端开发中的 微服务架构 或 组件化开发。你不是写一个 10 万行的巨型文件，而是拆分成多个小模块，每个模块专注一件事，通过接口通信。

### 实战：多 Agent 架构模式

在现代框架中，多 Agent 协作有几种常见模式：

1. 集中式编排（Centralized Orchestration）
```js
// Manager Agent 负责拆解和分配
const manager = new Agent({
  role: 'manager',
  systemPrompt: '你负责任务拆解和结果整合'
});

const frontendAgent = new Agent({ role: 'frontend-expert' });
const backendAgent = new Agent({ role: 'backend-expert' });

// 串行协调
const dbDesign = await backendAgent.designDatabase(requirements);
const apiSpec = await backendAgent.designAPI(dbDesign);
const uiCode = await frontendAgent.buildUI(apiSpec);
```

2. 自主协作（Autonomous Collaboration）

```js
// Agents 通过共享消息队列通信
const sharedState = new SharedMemory();

frontendAgent.on('message', (msg) => {
  if (msg.type === 'API_READY') {
    // 自动开始工作
    this.buildUI(msg.spec);
  }
});
```

3. 分层决策（Hierarchical Decision）
- L1 Manager：战略层（"做一个电商网站"）
- L2 Managers：战术层（前端经理、后端经理）
- L3 Workers：执行层（具体写代码的 Agent）

## 关键挑战：如何避免 Agent "吵架"？
在多 Agent 系统中，一个经典问题是：意见冲突。

场景：
- 前端 Agent："用 REST API，简单直接"
- 后端 Agent："用 GraphQL，灵活高效"
- 两者僵持不下，任务卡住。

解决方案：
- 明确职责边界：在 System Prompt 中定义"谁有最终决定权"。例如："后端专家负责 API 设计，前端专家必须接受"。
- 仲裁机制：Manager Agent 有最终裁决权。
- 投票机制：多个 Agent 投票，少数服从多数（适合民主型团队）。

### Manager 的决策框架
在实际的多 Agent 系统中，Manager 通常遵循这样的优先级层次：
1. 安全性 (Security) — 不可妥协
2. 正确性 (Correctness) — 功能必须正常
3. 可维护性 (Maintainability) — 代码可读、可测试
4. 性能 (Performance) — 在前三者满足后优化

为什么这个顺序很重要？
- 安全漏洞：一旦上线，可能导致数据泄露、法律风险（如 GDPR 罚款）
- 性能问题：可以通过后续优化（缓存、CDN、数据库索引）逐步改善
- 技术债务：性能债可以还，安全债可能直接导致公司倒闭

### 实战：如何实现冲突解决机制？
在 LangGraph 或类似框架中，你可以这样设计：

方法 1：硬编码优先级
```js
const CONFLICT_RESOLUTION = {
  security: 1,      // 最高优先级
  correctness: 2,
  maintainability: 3,
  performance: 4    // 最低优先级
};

function resolveConflict(conflicts: Conflict[]) {
  return conflicts.sort((a, b) => 
    CONFLICT_RESOLUTION[a.type] - CONFLICT_RESOLUTION[b.type]
  );
}
```

方法 2：加权投票

```js
// 每个 Agent 有"权重"，安全专家权重更高
const agents = {
  security: { weight: 0.5 },
  performance: { weight: 0.2 },
  maintainability: { weight: 0.3 }
};

// Manager 计算加权得分
const finalDecision = weightedVote(agentSuggestions);
```

方法 3：分阶段审查
```js
// 第一阶段：安全检查（一票否决）
const securityPass = await securityAgent.review(code);
if (!securityPass) {
  return { status: 'rejected', reason: 'Security issues found' };
}

// 第二阶段：性能和可维护性建议（非阻塞）
const perfSuggestions = await performanceAgent.review(code);
const maintSuggestions = await maintainabilityAgent.review(code);

return { status: 'approved', suggestions: [...perfSuggestions, ...maintSuggestions] };
```

### 多 Agent 系统的"沟通协议"

假设你有 3 个 Agent（Manager、前端专家、后端专家），它们需要共享信息。以下哪种架构最合理？
A. 每个 Agent 直接调用其他 Agent 的函数（点对点通信）
B. 所有 Agent 通过一个共享的消息队列/黑板系统通信（中心化通信）
C. Manager Agent 作为唯一的中转站，所有消息都经过它（星型拓扑）
D. Agents 不直接通信，各自独立工作，最后由 Manager 整合结果

架构对比：黑板系统 vs 星型拓扑
选项 B：共享消息队列/黑板系统

优点：
- 解耦：Agents 不需要知道彼此的存在，只需订阅/发布消息
- 可扩展：新增 Agent 只需注册到黑板，无需修改现有代码
- 异步性：天然支持异步处理，类似前端的 EventEmitter

缺点：
- 状态一致性：需要处理并发写入冲突
- 调试复杂：消息流向不直观，需要日志追踪

选项 C：Manager 作为中转站（星型拓扑）

优点：
- 集中控制：Manager 完全掌握全局状态，便于协调
- 调试简单：所有消息都经过 Manager，容易追踪
- 冲突解决：Manager 可以即时仲裁
缺点：
- 单点瓶颈：Manager 成为性能瓶颈
- 紧耦合：所有 Agents 都依赖 Manager
- 扩展困难：每增加一个 Agent，Manager 逻辑都要修改

实战：LangGraph 中的实现
在现代框架中，B 和 C 常常结合使用：
LangGraph 的 "State Graph" 模式（类似黑板 + 中心调度）：
```js
// 定义共享状态（黑板）
interface AgentState {
  messages: Message[];
  currentTask: string;
  results: Record<string, any>;
}

// 定义节点（Agents）
const workflow = new StateGraph<AgentState>({
  nodes: {
    manager: managerNode,
    frontend: frontendNode,
    backend: backendNode,
  },
  edges: {
    // 条件边：根据状态决定下一个节点
    conditional: (state) => {
      if (state.currentTask === 'design') return 'backend';
      if (state.currentTask === 'implement') return 'frontend';
    }
  }
});
```

这种模式下：
- 共享状态 是"黑板"（所有节点可读写）
- Graph 引擎 是"Manager"（决定执行顺序）
- 结合了两者的优点

假设你要为一个电商公司构建多 Agent 系统，需求如下：

高并发：每天处理 10 万 + 用户请求
快速迭代：每周都要新增 Agent（如"促销专家"、"物流优化师"）
强一致性：订单状态必须准确，不能出现超卖

选择混合架构：Manager 协调关键流程 + 黑板处理非关键通信。
- 这和前端开发中的 "关键路径优化 + 非关键路径异步" 思路完全一致：
- 关键流程（下单、支付、库存扣减）→ 需要强一致性，用 Manager 集中控制（类似 Redux Saga 处理事务）
- 非关键流程（推荐商品、发送通知、更新日志）→ 可以最终一致性，用黑板异步广播（类似 EventEmitter）

混合架构实战示例:
```js
// 关键流程：Manager 严格控制
class OrderManager {
  async processOrder(order: Order) {
    // 1. 锁定库存（原子操作）
    const stockLocked = await this.inventoryAgent.lock(order.productId, order.quantity);
    if (!stockLocked) throw new Error('库存不足');
    
    // 2. 创建订单（事务性）
    const orderResult = await this.orderAgent.create(order);
    
    // 3. 扣减库存（确认）
    await this.inventoryAgent.deduct(order.productId, order.quantity);
    
    // 4. 发布事件（非阻塞）
    this.eventBus.publish('order-completed', { orderId: orderResult.id });
    
    return orderResult;
  }
}

// 非关键流程：Agents 订阅事件自主工作
recommendationAgent.on('order-completed', async (data) => {
  // 异步更新用户画像，推荐相关商品
  await this.updateUserProfile(data.orderId);
});

notificationAgent.on('order-completed', async (data) => {
  // 异步发送确认邮件
  await this.sendEmail(data.orderId);
});
```
多 Agent 协作系统核心总结:
| 概念 | 核心要点 | 前端类比 |
|---------|---------|---------|
| 角色分工 | 每个 Agent 有明确的 System Prompt 定义职责 | 微前端模块 / 微服务 |
| 通信模式 | 点对点 vs 中心化 vs 混合 | Props vs Context vs Redux |
| 冲突解决 | 安全 > 正确性 > 可维护性 > 性能 | ESLint 规则优先级 |
| 架构选型 | 关键流程集中控制，非关键流程异步解耦 | 事务处理 vs 事件总线 |

多 Agent 协作系统核心要点
1. 角色分工与职责边界
- 每个 Agent 通过 System Prompt 定义明确的专家角色
- 避免职责重叠导致的冲突
2. 通信架构模式
- 点对点：紧耦合，难扩展（不推荐）
- 黑板系统：解耦，异步，适合非关键流程
- 星型拓扑：集中控制，易调试，但可能成为瓶颈
- 混合架构（最佳实践）：关键流程用 Manager 控制，非关键流程用事件总线
3. 冲突解决策略
- 优先级层次：安全 > 正确性 > 可维护性 > 性能
- 实现方式：硬编码优先级、加权投票、分阶段审查
4. 实战应用
- 电商系统：订单处理用 Manager 保证一致性，推荐/通知用事件总线异步处理
- 代码审查：安全专家有一票否决权

## Agent UI/UX 落地实践

风险分级框架 (Risk-Based Decision Making)

风险等级	示例操作	UI 策略
🔴 高风险	删除数据、支付、发布上线	必须显式确认（模态框 + 二次确认）
🟡 中风险	修改配置、生成代码、调用外部 API	静默执行 + 可撤销（展示进度 + 提供"撤销"按钮）
🟢 低风险	查询信息、生成草稿、格式化文本	完全自动（只需展示结果）

### 实际实现：一个 Agent UI 组件结构

```js
interface AgentMessage {
  type: 'thinking' | 'confirm' | 'action' | 'result' | 'error';
  riskLevel?: 'low' | 'medium' | 'high';
  content: string;
  requiresConfirmation?: boolean;
  actions?: Array<{
    label: string;
    type: 'approve' | 'reject' | 'modify';
    callback: () => void;
  }>;
}

// 使用示例
{
  type: 'confirm',
  riskLevel: 'high',
  content: '我准备删除数据库中的 1000 条旧记录',
  requiresConfirmation: true,
  actions: [
    { label: '✅ 确认删除', type: 'approve', callback: deleteRecords },
    { label: '❌ 取消', type: 'reject', callback: cancel },
    { label: '✏️ 修改条件', type: 'modify', callback: editQuery }
  ]
}
```

无状态 LLM → 前端必须做"记忆管理者":
```js
// ✅ 发送完整对话历史
const messages = [
  { role: 'system', content: '你是一个财务分析助手，擅长解读财报数据。' },
  { role: 'user', content: '帮我分析特斯拉的财务状况' },
  { role: 'assistant', content: '好的，我正在查询特斯拉的最新财报...' },
  { role: 'user', content: '继续' }  // 如果没有前面的历史，LLM 不知道"继续"什么！
];

const response = await fetch('/api/chat', {
  body: JSON.stringify({ messages })
});
```

```js
interface AgentSessionState {
  steps: Array<{
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'cancelled';
    result?: any;
    requiresConfirmation: boolean;
  }>;
  currentStepIndex: number;
  canRollback: boolean;
}

// 用户点击"取消"时
function handleCancel() {
  // 回滚到上一个已完成的步骤
  state.currentStepIndex = findLastCompletedStep();
  state.steps[currentStepIndex].status = 'cancelled';
  // 保留已完成步骤的结果
}
```