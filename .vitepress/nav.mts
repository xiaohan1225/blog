export default [
  { text: '开始', link: '/' },
  {
    text: 'Vue篇',
    link: '/note/vue/vue2响应式原理'
  },
  {
    text: '面试篇',
    items: [
      { text: '手写篇', link: '/note/interview/手写篇/实现有并行限制的 Promise 调度器' },
    ]
  },
  {
    text: 'JavaScript篇',
    items: [
      { text: 'JavaScript基础篇', link: '/note/javascript/js-base/001' },
      { text: 'JavaScript进阶篇', link: '/item-2' },
    ],
    activeMatch: '/note/javascript/'
  },
  // {
  //   text: 'TypeScript篇',
  //   items: [
  //     { text: 'TypeScript基础篇', link: '/note/typescript/1.ts介绍' },
  //     { text: 'TypeScript进阶篇', link: '/item-2' },
  //   ]
  // },
  {
    text: 'CSS篇',
    items: [
      { text: 'initial、revert、unset的区别', link: '/note/css/initial、revert、unset的区别' },
      { text: 'css知识点', link: '/note/css/css知识点' },
      { text: 'css性能优化', link: '/note/css/css性能优化' },
      { text: 'css面试题一', link: '/note/css/css面试题一' },
      { text: 'css面试题二', link: '/note/css/css面试题二' },
    ]
  },
  {
    text: '前端工程化篇',
    items: [
      { text: '脚手架篇', link: '/note/engineer/1.cli' },
      { text: 'npm篇', link: '/item-2' },
    ]
  },
  {
    text: '浏览器篇',
    items: [
      { text: '浏览器原理篇', link: '/note/browser/002' },
      { text: 'chrome插件篇', link: '/note/engineer/1.cli' },
      { text: '性能优化篇', link: '/note/performance/页面卡顿' },
      { text: 'EventLoop', link: '/note/browser/eventLoop' },
    ]
  },
  {
    text: '工作和编程技能',
    items: [
      { text: 'vim篇', link: '/note/vim/1.vim两种模式、基本移动操作以及复制剪切粘贴' },
      { text: '工作心得', link: '/note/work/1.如何封装组件' },
      { text: 'vscode快捷键和插件', link: '/note/vscode/快捷键和插件' },
      { text: 'vscode snippets', link: '/note/vscode/snippets' },
    ]
  },
]