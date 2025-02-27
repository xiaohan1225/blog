## 一、Nodejs架构

## 全局变量process

process是Nodejs内置的一个全局变量，用它可以获取很多信息。

1. 获取资源信息，包括内存、cpu

```js
console.log(process.memoryUsage());
/**
输出结果：
{
  rss: 30494720, 常驻内存大小
  heapTotal: 6438912, 堆内存大小
  heapUsed: 5678760,  已使用的堆内存
  external: 423221, c/c++底层模块加载占据的空间大小
  arrayBuffers: 17606 缓存区大小
}
*/

console.log(process.cpuUsage());
/**
输出结果：
 * {
 * 	user: 78000, 代码执行过程中，用户占用cpu的时间片段
 * 	system: 0 代码执行过程中，操作系统占用cpu的时间片段
 * }
 */
```

2. 获取运行环境信息，包括运行目录、node环境、cpu架构、用户环境、系统平台