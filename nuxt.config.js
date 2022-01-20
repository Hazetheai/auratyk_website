import webpack from 'webpack'

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
    title: 'Auratyk',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
  css: ['@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '@/components',
      extensions: ['vue'],
    },
    {
      path: '@/components/app',
      prefix: 'app',
      extensions: ['vue'],
    },
    {
      path: '@/components/elements',
      prefix: 'e',
      extensions: ['vue'],
    },
    {
      path: '@/components/blocks',
      prefix: 'block',
      extensions: ['vue'],
    },
    {
      path: '@/components/webgl',
      prefix: 'webgl',
      extensions: ['vue'],
    },
    {
      path: '@/components/svg',
      prefix: 'svg',
      extensions: ['vue'],
    },
  ],
  pageTransition: {
    name: 'page',
    mode: 'out-in',
    beforeLeave(el) {
      // console.log('Before leave...')
      this.$events.emit('cursor:enter', { type: 'default' })
    },
    leave(el) {
      // console.log('Enter...')
      this.$events.emit('scroller:reset')
    },
    afterLeave(el) {
      // console.log('After leave...')
    },
    beforeEnter(el) {
      // console.log('Before enter...')
    },
    enter(el) {
      // console.log('Enter...')
    },
    afterEnter(el) {
      // console.log('After enter...')
    },
  },
  loading: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://www.npmjs.com/package/@nuxtjs/style-resources
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

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/style-resources',
    'nuxt-mq',
    'nuxt-helmet',
    'nuxt-ssr-cache',
    'nuxt-compress',
  ],

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
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  plugins: [
    { src: '~/plugins/polyfills.js', mode: 'client' },
    { src: '~/plugins/events.js', mode: 'client' },
    { src: '~/plugins/frame.js', mode: 'client' },
    { src: '~/plugins/viewport.js', mode: 'client' },
    { src: '~/plugins/mouse.js', mode: 'client' },
    { src: '~/plugins/directives.js', mode: 'client' },
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/three.js', mode: 'client' },
    { src: '~/plugins/soundReactor.js', mode: 'client' },
    { src: '~/plugins/soundReactor.js', mode: 'client' },
    { src: '~/plugins/loadingController.js', mode: 'client' },
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend: (config) => {
      config.plugins.push(new webpack.ProvidePlugin({ THREE: 'three' }))
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      })
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
      ],
      presets({ isServer }) {
        return [
          [
            '@babel/preset-env',
            {
              targets: '> 2%, not dead',
            },
          ],
        ]
      },
    },
  },
}
