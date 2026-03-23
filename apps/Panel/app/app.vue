<template>
  <div class="dashboard-layout">
    <DashboardSidebar />
    
    <main class="main-content">
      <header class="top-bar">
        <h1>Tablero de Administración</h1>
      </header>

      <div class="content-padding">
        <div v-if="pendingCat || pendingProd" class="loading-overlay">Cargando datos del inventario...</div>
        
        <div v-else>
          <div class="stats-grid">
            <StatCard title="Total Productos" :value="productos?.length || 0" />
            <StatCard title="Categorías" :value="categorias?.length || 0" />
          </div>

          <div class="tables-grid">
            <InventoryTable title="Categorías" :headers="['Nombre', 'Descripción']" @add="showModalCat = true">
              <tr v-for="cat in categorias" :key="cat.id">
                <td>{{ cat.nombre }}</td>
                <td>{{ cat.descripcion || 'Sin descripción' }}</td>
              </tr>
              <tr v-if="!categorias?.length">
                <td colspan="2" class="empty">No se encontraron categorías.</td>
              </tr>
            </InventoryTable>

            <InventoryTable title="Productos" :headers="['Producto', 'Precio', 'Stock']" @add="showModalProd = true">
              <tr v-for="prod in productos" :key="prod.id">
                <td>{{ prod.nombre }}</td>
                <td>${{ prod.precio }}</td>
                <td>
                  <span :class="['badge', prod.stock < 5 ? 'low' : 'ok']">
                    {{ prod.stock }}
                  </span>
                </td>
              </tr>
              <tr v-if="!productos?.length">
                <td colspan="3" class="empty">No se encontraron productos.</td>
              </tr>
            </InventoryTable>
          </div>
        </div>
      </div>
    </main>

    <BaseModal v-model="showModalCat" title="Nueva Categoría">
      <form @submit.prevent="saveCategoria" class="form-grid">
        <input v-model="formCat.nombre" placeholder="Nombre de categoría" required class="input-field">
        <textarea v-model="formCat.descripcion" placeholder="Descripción (opcional)" class="input-field"></textarea>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar Categoría' }}
        </button>
      </form>
    </BaseModal>

    <BaseModal v-model="showModalProd" title="Nuevo Producto">
      <form @submit.prevent="saveProducto" class="form-grid">
        <input v-model="formProd.nombre" placeholder="Nombre del producto" required class="input-field">
        <input v-model.number="formProd.precio" type="number" step="0.01" placeholder="Precio" required class="input-field">
        <input v-model.number="formProd.stock" type="number" placeholder="Stock inicial" required class="input-field">
        
        <input v-model="formProd.sku" placeholder="SKU del producto" required class="input-field">
        
        <select v-model="formProd.categoriaId" required class="input-field">
          <option value="" disabled>Seleccionar Categoría</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar Producto' }}
        </button>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
// Extraemos las funciones de nuestro composable
const { getCategorias, getProductos, createCategoria, createProducto } = useInventario()

const loading = ref(false)
const showModalCat = ref(false)
const showModalProd = ref(false)

const formCat = reactive({ nombre: '', descripcion: '' })
const formProd = reactive({ nombre: '', precio: 0, stock: 0, sku: '', categoriaId: '' })

// Obtenemos los datos sin bloquear la pantalla (sin el await)
const { data: categorias, pending: pendingCat, refresh: refreshCat } = getCategorias()
const { data: productos, pending: pendingProd, refresh: refreshProd } = getProductos()

const saveCategoria = async () => {
  loading.value = true
  try {
    await createCategoria(formCat)
    await refreshCat() 
    showModalCat.value = false
    Object.assign(formCat, { nombre: '', descripcion: '' })
  } catch (e) {
    alert('Error al guardar categoría')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const saveProducto = async () => {
  loading.value = true
  try {
    await createProducto(formProd)
    await refreshProd()
    showModalProd.value = false
    Object.assign(formProd, { nombre: '', precio: 0, stock: 0, sku: '', categoriaId: '' })
  } catch (e) {
    alert('Error al guardar producto. Revisa la consola.')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>