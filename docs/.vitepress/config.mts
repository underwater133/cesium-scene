import { defineConfig } from 'vitepress'
const isProd = process.env.NODE_ENV === 'production'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isProd ? '/cesium-scene/' : '/',
  title: "Azusa's Playground",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/underwater133/cesium-scene' }
    ]
  },
  head: [
    ['link', { rel: 'icon', href: `${isProd ? '/cesium-scene' : ''}/images/doro.png` }]
  ],
  // plugins: [
  //   require('./plugins/cesium-api-docs')
  // vite: {
  //   resolve: {
  //     alias: {
  //       cesium: resolve(__dirname, '../../node_modules/cesium/Source')
  //     }
  //   },
  //   define: {
  //     CESIUM_BASE_URL: JSON.stringify('/cesium/')
  //   },
  //   build: {
  //     rollupOptions: {
  //       external: ['fs'] // 防止打包时引入 Node.js 模块
  //     }
  //   }
  // }
})
