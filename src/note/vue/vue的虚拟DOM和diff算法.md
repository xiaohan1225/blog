---
title: 002 Vue2的虚拟DOM和diff算法
date: 2022-03-29
categories:
  - Vue
tags:
  - Vue2.0
sidebar: "auto"
---

## 背景
- DOM操作非常耗费性能（js操作比较快）
- 以前命令式的jquery可以自行控制操作DOM的时机，而对于声明式的靠数据驱动视图的vue和react，需要更加有效地控制DOM操作
- 由react首先提出，vue2.0开始采用，借鉴了[snabbdom](https://github.com/snabbdom/snabbdom)的实现，并添加了许多自己的特性

> `Vue`在`1.0`版本的时候是没有引入`虚拟DOM`，由于响应式系统的存在，`Vue`可以精确地知道具体哪些节点的状态发生了变化，从而对这些节点进行细粒度的`更新操作`，根本不需要比对。然而这种方式的缺陷在于要为每个节点创建一个`Watcher`，在项目复杂时，其`创建Watcher`的内存开销和进行`依赖追踪`的开销就会很大。<br/>
于是`Vue`在`2.0`版本时引入了`虚拟DOM`，将组件的更新粒度变为`中等粒度`，每一个组件对应一个`Watcher`，即使同一时间组件里的多个状态均发生变化，组件也只会`更新一次`。

## 解决方案-vdom
- 有了一定的复杂度，想减少计算次数比较难
- 但可以把计算更多地转移为js计算，因为js执行速度很快
- 用js模拟DOM结构，计算出最小的变更，操作DOM
```js
{
    tag: 'div',
    props: {
        id: 'div1',
        className: 'container',
    },
    children: [
        {
            tag: 'p',
            children: [
                {
                    tag: undefined,
                    text: 'vdom'
                }
            ]
        },
        {
            tag: 'ul',
            props: {
                style: {
                    fontSize: '20px'
                }
            },
            children: [
                {
                    tag: 'li',
                    props: {},
                    children: [
                        {
                            tag: undefined,
                            text: 'a',
                        }
                    ]
                }
            ]
        }
    ]
}
```

## vdom的作用
1. 保证性能下限
2. 跨平台

## diff算法
### 概述
- diff算法是vdom中最核心、最关键的部分
- diff算法能在日常使用vue react中体现出来（如key 随机数没用 每次重新渲染都是新的随机数）
- diff即对比，是一个广泛的概念，如linux diff命令、git diff等
- 两个js对象也可以做diff
- 两棵树做diff，如vdom diff

### 树diff的时间复杂度是O(n ^ 3)
- 第一遍历tree1，第二，遍历tree2，第三，排序
- 1000个节点，要计算1亿次，算法不可用

### 优化时间复杂度到O(n)
- 只比较同一层级，不跨级比较
- tag不相同，则直接删掉重建，不再深度比较
- tag和key，两者都相同，则认为是相同节点，不再深度比较

### patch方法
patch方法是将vnode渲染成真实的DOM，它主要做三件事：
1. 创建新增的节点
2. 删除多余的节点
3. 修改需要更新的节点

比较策略：
- vnode相同，走patchVnode
- vnode不同，删除重建



### diff算法总结
- patchVnode
- addVnodes removeVnodes
- updateChildren(key的重要性)

## vdom和diff总结
- vnode的核心概念：h、vnode、patch、diff、key等
- vnode存在的价值：数据驱动视图，控制DOM操作



