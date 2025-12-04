## 如何清理没有被应用到的js、ts、css代码
1. Eslint、terser通过ast解析，可以分析出哪些代码没有被使用到，缺点是只能处理单模块
2. Tree-shaking：可以处理多模块
3. Purgecss：删除未使用的css（CSS原子化）
4. 自定义