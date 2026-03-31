## ssr应用工程化问题
1. 路由管理
2. 全局状态管理
3. CSR降级
4. 浏览器API兼容
5. 自定义
6. 流式渲染(页面边渲染边响应，而不是等整个组件树渲染完毕之后再响应，这样可以让响应提前到达客户端，提升了首屏加载速度,React 提供了 rendertonodestream（官方文档显示已弃用），Vue 则提供了 renderToNodeStream)
7. SSR缓存
8. 性能监控
9. SSG/ISR/SPR

### 性能监控
- SSR 产物加载时间
- 数据预取的时间
- 组件渲染的时间
- 服务端接受请求到响应的完整时间
- SSR 缓存命中情况
- SSR 成功率、错误日志

使用 `perf_hooks(node内置模块)` 完成数据采集：
```js
import { performance, PerformanceObserver } from 'perf_hooks';

// 初始化监听器逻辑，用于性能监控
const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log('[performance]', entry.name, entry.duration.toFixed(2), 'ms');
  });
  performance.clearMarks();
});
perfObserver.observe({ entryTypes: ['measure'] });

async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  return async (req, res, next) => {
    try {

      //* 3.渲染服务端组件，转换为 HTML 字符串
      performance.mark('render-start');
      const appHtml = renderToString(
        React.createElement(serverEntry, { data })
      );
      performance.mark('render-end');
      performance.measure('renderToString', 'render-start', 'render-end');
    } catch () {}
  };
}
```

## vue ssr 项目改造注意点
- vue生命周期钩子只有`beforeCreate`和`created`能用
- 避免在 `beforeCreate` 和 `created` 生命周期时产生全局副作用的代码，比如你写了一个setInterval，客户端会在`beforeDestroy`或者`destroyed`中销毁，而服务端渲染中就没法销毁了，所以这种副作用的代码需要放在`beforeMount`或者`mounted`中。

## 注意事项
- 使用无全局 window/document 的依赖
减少复杂度高的运算，避免 O(n ^2)

## 优化策略
QPS（Query Per Second）也就是每秒的请求数，你的项目QPS是多少，如何提高吞吐？

SSR的耗时主要是以下两个方面：
- CPU 计算：运行 JS，渲染出静态的 DOM 结构
  - 优化和改进算法，我们用的核心算法都在方法内部，比如`vue-server-renderer`、`vite`，要选择尽可以快的生成方案
  - 精简首屏的DOM结构和数据，减少包大小
  - 业务代码时间复杂度比较高，也可以优化
- 网络 IO：获取首屏所需接口数据
  - 使用内网请求接口
  - 减少网络包体积，和后端协商，只返回必须的字段，或者后端某些耗时的字段上缓存
  - 缓存（真的需要缓存么？缓存利用率，考虑用户网络，不需要做组件这种细粒度的缓存，侵入业务代码导致可维护性下降）

- 动态内容缓存：将数据和表现整体打包，就像餐饮店的组合套餐一样。
- 数据缓存：更细粒度。

## 降级策略
- 超过一定阈值，降级成CSR，也就是返回静态资源
- 网络抖动导致服务端某些数据拉取失败，要在客户端保证用户能看到全的数据

## 日志与告警
可观测，可追踪


## SLO
SLO 是 Service Level Objective，中文一般叫服务等级目标。

它不是一句“系统要快”，而是一个可量化目标，用来定义“服务做到什么程度算达标”。

比如对你的活动页 SSR，可以定义这样的 SLO：

99.9% 的页面请求成功
SSR 响应 p95 < 200ms
首屏接口错误率 < 0.1%
这就是 SLO。

容易混淆的还有两个词：

SLI

Service Level Indicator
是指标本身，比如响应时间、成功率、错误率、可用性
SLO

Service Level Objective
是你给这些指标定的目标值，比如 p95 < 200ms
SLA

Service Level Agreement
是对外承诺，通常带商业或合同约束
你前面那句“当 SSR 延迟超过阈值就关预渲染”，里面这个阈值最好就从 SLO 来定。
比如你定：

正常 SSR 请求 SLO：p95 < 200ms
那预渲染熔断线就可以设成：

p95 > 150ms 开始降载
p95 > 180ms 关闭预渲染
也就是：先保 SLO，再谈优化能力。

一句话理解：

SLI = 你量什么
SLO = 你希望做到多少
SLA = 你对别人承诺多少