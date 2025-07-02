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
    ]
  },
]