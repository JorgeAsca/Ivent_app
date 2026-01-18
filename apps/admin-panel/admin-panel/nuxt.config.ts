export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],


  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://38.242.141.205:3000/api'
    }
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],


  routeRules: {
    '/': { prerender: true },
    '/api/**': { proxy: 'http://38.242.141.205:3000/api/**' }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
