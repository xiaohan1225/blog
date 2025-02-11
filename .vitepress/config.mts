import { defineConfig } from 'vitepress'
import nav from './nav.mts'
import sidebar from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "小寒的博客",
  description: "喜欢JavaScript、专注于做前端、后端技术分享",
  srcDir: './src',
  srcExclude: ['**/README.md'],
  // outDir: '../public',
  base: '/blog/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaohan1225' }
    ]
  }
})
