export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon'
  ],

  future: {
    compatibilityVersion: 4,
  },


  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://38.242.141.205:3000/api'
    }
  },

  icon: {
  serverBundle: 'local'
},

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],


  routeRules: {
    '/': { prerender: true },
    '/api/inventario/**': { proxy: 'http://38.242.141.205:3000/api/inventario/**' },
    '/api/usuarios/**': { proxy: 'http://38.242.141.205:3000/api/usuarios/**' },
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
