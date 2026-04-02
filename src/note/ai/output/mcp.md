## MCP 是什么？

MCP 的全称是 `Model Context Protocol`，中文名叫 `模型上下文协议`。

说起协议，很自然会联想到我们熟知的一些协议，比如 `网络相关的 HTTP、TCP、UDP、WebSocket 协议`，协议的本质就是**通信双方事先约定好的规则**，那么 MCP 约定了哪些通信规则呢？

## MCP 通信规则

通信方式：
- stdio: 推荐，高效，简洁，本地
- http: 远程

通信格式：基于 JSON-RPC 的进一步规范

