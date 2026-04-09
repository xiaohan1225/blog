## 面试题
- 你的 Agent 调用外部工具超时了怎么办？
- 重试策略怎么设计？
- 多轮对话的上下文越来越长，token 成本爆炸，你怎么处理？
- Agent 产生了幻觉，执行了错误操作，你的系统怎么兜底？
- RAG 检索出来的内容相关性不够，你怎么优化召回？线上 Agent 的效果怎么评估？怎么做 A/B 测试？

## 第一阶段：补 AI 基础认知
不需要你去学 Transformer 的数学推导。

你需要理解的是：
- Token 是什么、上下文窗口的限制、temperature/top_p 怎么影响输出
- Function Calling / Tool Use 的原理——这是 Agent 的核心机制
- Prompt Engineering 的基本套路，few-shot、CoT、ReAct
- 各家模型的差异和选型（GPT-4o、Claude、Gemini、国内的 Qwen/DeepSeek）

## 第二阶段：RAG 全链路

- 文档解析（PDF、网页、代码）→ 分块策略（固定长度 vs 语义分块）
- Embedding 模型选型（OpenAI ada、BGE、Jina）
- 向量数据库（Milvus、Chroma、Pgvector——你熟 PG 的话 pgvector 上手最快）
- 检索策略：向量检索 + BM25 混合检索、rerank、query 改写
- 生成阶段：context 拼接、prompt 模板、幻觉控制

重点是自己动手做一个完整的 RAG 系统，不要用框架的一键封装，自己把每个环节拆开写。面试的时候你能讲清楚每一步为什么这么做、有什么坑。

## 第三阶段：Agent 架构

- 单 Agent：ReAct 模式、Tool Calling、Memory 管理
- Multi-Agent：任务拆解、Agent 间通信、结果汇总
- 框架层面 LangGraph、CrewAI、AutoGen 选一两个深入看，但重点不是 API 怎么调，而是理解它们的设计思想
- 自己从零实现一个简单的 Agent 框架——面试加分项，证明你理解原理而不只是会用工具

## 第四阶段：工程化（这是你的杀手锏）
- Agent 的可观测性：怎么 trace 每一步的推理过程、工具调用、耗时
- 成本控制：token 用量监控、缓存策略、模型降级
- 可靠性：超时处理、幻觉检测、人工兜底机制
- 评估体系：怎么量化 Agent 的效果、怎么做回归测试
- 部署：流式响应、并发控制、队列管理


## 深入学习

### 向量数据库

一开始我以为，向量数据库不就是"存Embedding，然后做相似度搜索"嘛，有啥难的？后来面试被问："为什么Pinecone用HNSW算法，Milvus支持多种索引？什么场景下该选哪种？"我才发现，我对向量数据库的理解，停留在"会用"的层面，根本不懂原理。后来我花了一个月时间，把向量检索的几个核心算法都搞明白了：•HNSW（分层图结构）：查询快，但内存占用大，适合高QPS的场景•IVF（倒排索引+聚类）：适合大规模离线检索•Annoy（随机投影树）：内存占用小，但召回率稍低然后我还自己动手，用Milvus搭了一个支持千万级向量的检索系统，踩了一堆坑：•冷启动问题：新文档的Embedding怎么快速索引？•增量更新：怎么在不重建索引的情况下更新向量？•多租户隔离：怎么在共享集群里做租户级别的数据隔离？


### RAG（别停留在Naive RAG）
我刚开始学RAG的时候，写的代码是这样的：
```python
def naive_rag(query):
    docs = vector_db.search(query, top_k=5)
    context = "\n".join(docs)
    response = llm.generate(f"Context: {context}\nQuery: {query}")
    return response
```
我以为这就是RAG了。结果面试官问我："你这个RAG有什么问题？

"我：......没问题啊？

面试官：检索质量差、上下文窗口浪费、无法处理多跳推理、缺乏可解释性。

我：......（又是一片空白）

后来我才知道，Naive RAG只是最基础的版本，生产环境里根本不够用。真正的RAG，要做这些优化：

第一步：Query优化

- Query Rewriting：把用户的问题改写成更适合检索的形式
- Query Decomposition：把复杂问题拆成几个子问题
- HyDE：先让LLM生成一个假设性的答案，再用这个答案去检索

第二步：检索优化
- Hybrid Search：向量检索+BM25，两个结果融合
- Reranking：用Cross-Encoder重新排序
- Contextual Compression：把无关的内容压缩掉

第三步：生成优化
- Self-RAG：让模型自己判断要不要检索
- CRAG：检测检索结果的质量，如果不行就回退到网络搜索这些东西，我是自己一点点摸索出来的。

### Agent架构（这才是核心）

Agent这块，我踩的坑最多。一开始我以为，Agent就是"LLM + Tools"，让LLM调用几个工具就完事了。后来我发现，Agent的核心不是"调用工具"，而是"推理过程的设计"。ReAct模式（最基础但最重要）ReAct就是让LLM交替进行"推理"和"行动"。

```py
def react_agent(task):
    history = []
    while not is_finished():
        # 推理：下一步该做什么
        thought = llm.generate(f"Task: {task}\nHistory: {history}\nThought:")
        
        # 行动：执行工具
        action = parse_action(thought)
        observation = execute_tool(action)
        
        history.append({"thought": thought, "action": action, "observation": observation})
    
    return final_answer
```
看起来简单吧？但实际上，这里面有一堆问题：
- 推理错误怎么办？→ 需要Reflexion机制，让Agent反思自己的错误
- 推理效率低怎么办？→ 需要Few-shot示例，提供高质量的推理样本
- 任务太长怎么办？→ 需要分层ReAct，把任务拆成子任务这些问题，我都是在实际项目里踩坑才知道的。

Plan-and-Execute模式（适合复杂任务）

这个模式是先让LLM生成一个完整的计划，然后逐步执行。

```py
def plan_and_execute(task):
    # 生成计划
    plan = planner.generate_plan(task)
    
    # 执行计划
    results = []
    for step in plan:
        result = executor.execute(step, context=results)
        results.append(result)
        
        # 如果执行失败，重新规划
        if need_replan(result):
            plan = planner.replan(task, results)
    
    return results
```

这个模式的难点在于：
- 怎么生成高质量的计划？→ 需要结构化输出，用JSON Schema约束
- 什么时候触发重规划？→ 执行失败、发现新信息、用户需求变更
- 哪些步骤可以并行？→ 需要分析步骤之间的依赖关系

### Multi-Agent协作（最复杂）

这是我觉得最难的部分。怎么让多个Agent协作完成任务？

我试过三种架构：
- 中心化调度：一个主Agent负责分配任务给其他Agent
- 去中心化协商：Agent之间自己协商谁做什么
- 分层管理：大Agent管小Agent每种架构都有优缺点，具体用哪种，得看业务场景。

### Memory系统（这块容易被忽视）

一开始我觉得，Memory不就是"把对话历史存起来"嘛。

后来我发现，Memory系统的设计，直接影响Agent的智能程度。

我把Memory分成三层：

第一层：工作记忆（就是当前对话的上下文）
```py
class ConversationBuffer:
    def __init__(self, max_tokens=2000):
        self.messages = []
    
    def add_message(self, message):
        self.messages.append(message)
        # 超出token限制就删掉最早的消息
        while self.count_tokens() > self.max_tokens:
            self.messages.pop(0)
```
第二层：短期记忆（定期总结）

```py
class SummaryMemory:
    def __init__(self):
        self.summary = ""
        self.recent_messages = []
    
    def add_message(self, message):
        self.recent_messages.append(message)
        
        # 每10条消息总结一次
        if len(self.recent_messages) > 10:
            self.summary = llm.summarize(self.summary, self.recent_messages)
            self.recent_messages = []
```

第三层：长期记忆（向量数据库）

```py
class VectorMemory:
    def store(self, memory_item):
        self.vector_db.insert({
            "text": memory_item.text,
            "embedding": embed(memory_item.text),
            "timestamp": memory_item.timestamp,
            "importance": memory_item.importance
        })
    
    def retrieve(self, query):
        return self.vector_db.search(query, top_k=5)
```

这套Memory系统，我是参考人类的记忆机制设计的。

效果还不错，但实现起来挺麻烦的。

###  生产化工程（这是P7+的分水岭）

前面那些都是"能跑"的层面，但生产环境还要考虑：

#### 可观测性（怎么debug一个失败的Agent？）
传统后端系统，你可以看日志、看Trace。但Agent系统，一个任务可能涉及几十次LLM调用，每次调用的输入输出都不一样，怎么追踪？我自己实现了一个简单的追踪系统：
```py
class AgentTracer:
    def start_span(self, name, inputs):
        span = {
            "span_id": generate_id(),
            "name": name,
            "start_time": time.time(),
            "inputs": inputs
        }
        self.spans.append(span)
        return span
    
    def end_span(self, span_id, outputs):
        span = self.find_span(span_id)
        span["end_time"] = time.time()
        span["outputs"] = outputs
        span["duration"] = span["end_time"] - span["start_time"]
```
有了这个，我就能看到Agent的完整推理链路，哪一步出问题了一目了然。

#### 成本优化（怎么省钱？）
LLM调用是要花钱的，而且不便宜。我总结了几个省钱的技巧：
1. 智能模型路由：简单任务用便宜的模型，复杂任务用贵的模型。
2. Prompt压缩：用LLMLingua这种工具，把Prompt从500 tokens压缩到200 tokens。
3. 语义缓存：相似的问题直接返回缓存的答案这些优化做完，成本能降低30-50%。

#### 安全性（怎么防止Agent被攻击？）

这块我一开始完全没意识到，后来看到有人用Prompt Injection攻击Agent，我才知道这事儿有多严重。主要防御三个方面：
1. 输入验证：检测用户输入里有没有注入攻击
2. 工具访问控制：限制Agent能调用哪些工具
3. 输出验证：检查Agent的输出有没有泄露敏感信息

