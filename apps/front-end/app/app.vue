<template>
  <div class="main-container">
    <header>
      <h1>Prueba de Conexión: Backend en VPS</h1>
      <p>Estado de la API: {{ config.public.apiBase }}</p>
    </header>

    <div class="dashboard">
      <section class="card">
        <h2>Categorías</h2>
        <div v-if="pendingCat" class="loading">Cargando categorías...</div>
        <div v-else-if="errorCat" class="error">Error: {{ errorCat.message }}</div>
        <ul v-else>
          <li v-for="cat in categorias" :key="cat.id">
            <strong>{{ cat.nombre }}</strong>: {{ cat.descripcion }}
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>Productos</h2>
        <div v-if="pendingProd" class="loading">Cargando productos...</div>
        <div v-else-if="errorProd" class="error">Error: {{ errorProd.message }}</div>
        <div v-else>
          <table v-if="productos?.length > 0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in productos" :key="prod.id">
                <td>{{ prod.nombre }}</td>
                <td>${{ prod.precio }}</td>
                <td>{{ prod.stock }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No hay productos registrados.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Accedemos a la configuración definida en nuxt.config.ts
const config = useRuntimeConfig()

// Petición a Categorías (Gateway -> MS Inventario)
const { 
  data: categorias, 
  pending: pendingCat, 
  error: errorCat 
} = await useFetch('/categorias', {
  baseURL: config.public.apiBase
})

// Petición a Productos (Gateway -> MS Inventario)
const { 
  data: productos, 
  pending: pendingProd, 
  error: errorProd 
} = await useFetch('/productos', {
  baseURL: config.public.apiBase
})
</script>

<style scoped>
.main-container {
  padding: 2rem;
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}
.card {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  background: #f9f9f9;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
.error { color: red; font-weight: bold; }
.loading { color: #666; font-style: italic; }
</style>