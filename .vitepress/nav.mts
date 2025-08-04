export default [
  { text: '开始', link: '/' },
  {
    text: 'Vue篇',
    link: '/collect/vue/vue2响应式原理'
  },
  {
    text: 'JavaScript篇',
    items: [
      { text: 'JavaScript基础篇', link: '/collect/javascript/js-base/001' },
      { text: 'JavaScript进阶篇', link: '/item-2' },
    ],
    activeMatch: '/collect/javascript/'
  },
  {
    text: 'TypeScript篇',
    items: [
      { text: 'TypeScript基础篇', link: '/collect/typescript/1.ts介绍' },
      { text: 'TypeScript进阶篇', link: '/item-2' },
    ]
  },
  {
    text: 'CSS篇',
    items: [
      { text: 'initial、revert、unset的区别', link: '/collect/css/initial、revert、unset的区别' },
      { text: 'css知识点', link: '/collect/css/css知识点' },
    ]
  },
  {
    text: '前端工程化篇',
    items: [
      { text: '脚手架篇', link: '/collect/engineer/1.cli' },
      { text: 'npm篇', link: '/item-2' },
    ]
  },
  {
    text: '浏览器篇',
    items: [
      { text: '浏览器原理篇', link: '/collect/browser/002' },
      { text: 'chrome插件篇', link: '/collect/engineer/1.cli' },
      { text: '性能优化篇', link: '/collect/performance/页面卡顿' },
    ]
  },
  {
    text: '工作和编程技能',
    items: [
      { text: 'vim篇', link: '/collect/vim/1.vim两种模式、基本移动操作以及复制剪切粘贴' },
      { text: '工作心得', link: '/collect/work/1.如何封装组件' },
    ]
  },
]