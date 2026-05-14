import webpack from 'webpack'
import getSiteMeta from './assets/js/utils/getSiteMeta'
require('dotenv').config()

const meta = getSiteMeta()
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default {
  version: uuidv4(),
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // title: '',
    // titleTemplate: 'Auratyk | %s',
    title: 'Auratyk',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Auratyk',
      },
      ...meta,
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: process.env.BASE_URL,
      },
    ],
    script: [
      {
        src: 'https://unpkg.com/codyhouse-framework/main/assets/js/util.js',
        async: true,
      },
    ],
    htmlAttrs: {
      class: 'js',
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/_base.scss', '@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '@/assets/icons',
      prefix: 'icon',
      extensions: ['vue'],
    },
  ],
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    beforeLeave(el) {
      this.$events.emit('cursor:enter', { type: 'default' })
    },
    leave(el) {
      this.$events.emit('scroller:reset')
    },
    afterLeave(el) {
    },
    beforeEnter(el) {
    },
    enter(el) {
    },
    afterEnter(el) {
    },
  },
  loading: false,
  image: {
    domains: ['www.dropbox.com', 'dl.dropboxusercontent.com'],
  },
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/image',
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: [
      '~assets/scss/shared/_mixins.scss',
      '~assets/scss/shared/_breakpoints.scss',
      '~assets/scss/shared/_media.scss',
    ],
    hoistUseStatements: true, // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-mq',
    'nuxt-helmet',
    'nuxt-compress',
    '@nuxtjs/google-fonts',
    '@nuxtjs/dotenv',
  ],

  googleFonts: {
    families: {
      'Space+Grotesk': [300, 400, 700],
      'Space+Mono': [100, 300],
    },
    prefetch: true,
    preconnect: true,
    preload: true,
    display: 'swap',
  },

  mq: {
    defaultBreakpoint: 'default',
    breakpoints: {
      mobile: 769,
      desktop: Infinity,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://auratyk.com', // Used as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    staticForms: process.env.STATIC_FORMS_KEY,
    sheetsEndpoint: process.env.SHEETS_CONTACT_ENDPOINT,
    sheetsTabId: process.env.SHEETS_CONTACT_TAB_ID,
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
  server: {
    host: '0', // default: localhost
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    staticForms: process.env.STATIC_FORMS_KEY,
    sheetsEndpoint: process.env.SHEETS_CONTACT_ENDPOINT,
    sheetsTabId: process.env.SHEETS_CONTACT_TAB_ID,
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  plugins: [
    { src: '~/plugins/events.js', mode: 'client' },
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/auratyk-home.js', mode: 'client' },
    { src: '~/plugins/codyhouse-utils.js', mode: 'client' },
    { src: '~/plugins/soundReactor.js', mode: 'client' },
    { src: '~/plugins/loadingController.js', mode: 'client' },
    { src: '~/plugins/scrollHandlers.js', mode: 'client' },
    { src: '~/plugins/insights-analytics.js', mode: 'client' },
    { src: '~plugins/vue-js-modal.js', mode: 'client' },
    { src: '~plugins/logsnag.js', mode: 'client' },
  ],

  hooks: {
    'generate:before': async () => {
      if (process.env.NOTION_API_KEY) {
        try {
          const { main } = require('./scripts/fetch-notion')
          await main()
        } catch (err) {
          console.error('Notion fetch failed:', err.message)
        }
      } else {
        console.warn('⏭ Skipping Notion fetch (NOTION_API_KEY not set)')
      }
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        sassOptions: {
          silenceDeprecations: ['legacy-js-api', 'import', 'if-function', 'global-builtin'],
        },
      },
    },
    extend: (config) => {
      config.plugins.push(new webpack.ProvidePlugin({ THREE: 'three' }))
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      })

      config.context = __dirname
      config.node = {
        __filename: true,
      }
    },
  },
}
