<template>
  <div>
    <div class="header-actions">
      <h2>Gestión de Inventario</h2>
    </div>

    <div v-if="pendingProd || pendingCat" class="loading-overlay">Cargando datos...</div>
    
    <div v-else>
      <InventoryTable title="Administrar Productos" :headers="['Producto', 'SKU', 'Categoría', 'Precio', 'Stock', 'Acciones']" @add="openCreateProd">
        <tr v-for="prod in productos" :key="prod.id">
          <td>{{ prod.nombre }}</td>
          <td>{{ prod.sku }}</td>
          <td>
            <span class="badge ok">
              {{ getNombreCategoria(prod.categoria_id || prod.categoriaId) }}
            </span>
          </td>
          <td>${{ prod.precio }}</td>
          <td>{{ prod.stock }}</td>
          <td>
            <button @click="openEditProd(prod)" style="margin-right: 5px; cursor: pointer;">✏️</button>
            <button @click="borrarProducto(prod.id)" style="color: red; cursor: pointer;">🗑️</button>
          </td>
        </tr>
      </InventoryTable>
    </div>

    <BaseModal v-model="showModalProd" :title="editMode ? 'Editar Producto' : 'Nuevo Producto'">
      <form @submit.prevent="saveProducto" class="form-grid">
        <input v-model="formProd.nombre" placeholder="Nombre" required class="input-field">
        <input v-model.number="formProd.precio" type="number" step="0.01" placeholder="Precio" required class="input-field">
        <input v-model.number="formProd.stock" type="number" placeholder="Stock" required class="input-field">
        <input v-model="formProd.sku" placeholder="SKU" required class="input-field">
        
        <select v-model="formProd.categoria_id" required class="input-field">
          <option value="" disabled>Seleccionar Categoría</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
        
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear') }}
        </button>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
const { getCategorias, getProductos, createProducto, updateProducto, deleteProducto } = useInventario()

const loading = ref(false)
const showModalProd = ref(false)
const editMode = ref(false)
const selectedProdId = ref(null)

const formProd = reactive({ nombre: '', precio: 0, stock: 0, sku: '', categoria_id: '' })

const { data: categorias, pending: pendingCat } = getCategorias() 
const { data: productos, pending: pendingProd, refresh: refreshProd } = getProductos()

// FUNCIÓN BLINDADA
const getNombreCategoria = (id) => {
  if (!categorias.value || !id) return 'Sin categoría'
  // Limpiamos el ID por si vienen espacios o tipos diferentes
  const targetId = String(id).trim()
  const cat = categorias.value.find(c => String(c.id).trim() === targetId)
  return cat ? cat.nombre : 'No encontrada'
}

const openCreateProd = () => { 
  Object.assign(formProd, { nombre: '', precio: 0, stock: 0, sku: '', categoria_id: '' })
  editMode.value = false; showModalProd.value = true; 
}

const openEditProd = (prod) => {
  Object.assign(formProd, { 
    nombre: prod.nombre, 
    precio: prod.precio, 
    stock: prod.stock, 
    sku: prod.sku, 
    categoria_id: prod.categoria_id || prod.categoriaId 
  })
  selectedProdId.value = prod.id; editMode.value = true; showModalProd.value = true;
}

const saveProducto = async () => {
  loading.value = true
  try {
    if (editMode.value) await updateProducto(selectedProdId.value, formProd)
    else await createProducto(formProd)
    await refreshProd()
    showModalProd.value = false
  } catch (e) { alert('Error al guardar'); } finally { loading.value = false }
}

const borrarProducto = async (id) => {
  if(!confirm('¿Eliminar producto?')) return
  try { await deleteProducto(id); await refreshProd(); } catch (e) { alert('Error'); }
}
</script>