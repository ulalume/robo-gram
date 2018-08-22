module.exports = {
  env:{
  },
  head: {
    title: 'ROBOGRAM',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.3.1.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/velocity/2.0.5/velocity.min.js' },
      { src: 'https://unpkg.com/ionicons@4.1.2/dist/ionicons.js' }
    ]
  },
  loading: {
    color: '#3B8070'
  },
  plugins: [
    '~plugins/element-ui'
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  modules: [
    '@nuxtjs/pwa'
  ],
  workbox: {
    dev: true, //開発環境でもPWAできるように
  },
  manifest: {
    name: 'ROBOGRAM',
    short_name: 'ROBOGRAM',
    title: 'ROBOGRAM',
    'og:title': 'ROBOGRAM',
    description: 'ROBOGRAM',
    'og:description': 'ROBOGRAM',
    lang: 'ja',
    theme_color: '#192734',
    background_color: '#192734'
  },
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      let position = {}
      if (to.matched.length < 2) {
        position = { x: 0, y: 0 }
      } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
        position = { x: 0, y: 0 }
      }
      if (to.hash) {
        position = { selector: to.hash }
      }
      return position
    },
  },
  build: {
    vendor: ['axios','element-ui'],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
}
