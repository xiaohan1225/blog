import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "小寒的小木屋",
  description: "喜欢JavaScript、专注于做前端、后端技术分享",
  srcDir: './src',
  srcExclude: ['**/README.md'],
  // outDir: '../public',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端知识库', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'vitepress篇',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaohan1225' }
    ]
  }
})
