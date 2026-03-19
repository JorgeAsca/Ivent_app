export default defineNuxtConfig({
  // 1. Forzamos la estructura de Nuxt 3 donde app.vue está en la raíz
  future: {
    compatibilityVersion: 4,
  },
  
  // 2. Indicamos que la raíz del código es esta carpeta
  srcDir: '.',

  compatibilityDate: '2024-04-03',

  runtimeConfig: {
    public: {
      // Reemplaza con la IP real de tu VPS
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://38.242.141.205:3000'
    }
  },

  // Opcional: Para limpiar la consola de advertencias de Vite
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  }
})