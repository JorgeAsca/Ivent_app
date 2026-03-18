export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon'
  ],


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
    // Solo redirigir las llamadas que NO sean de recursos internos de Nuxt
    '/api/inventario/**': { proxy: 'http://38.242.141.205:3000/api/inventario/**' },
    '/api/usuarios/**': { proxy: 'http://38.242.141.205:3000/api/usuarios/**' },
    // Agrega aquí otros microservicios si los necesitas (administracion, etc.)
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
