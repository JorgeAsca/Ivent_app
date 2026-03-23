export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: { 
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://38.242.141.205:3000'
    }
  }
})
