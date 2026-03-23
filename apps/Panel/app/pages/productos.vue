<template>
    <div>
        <div class="header-actions">
            <h2>Gestión de Inventario</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button @click="openCreateCat" class="btn-primary">Nueva Categoría</button>
                <button @click="openCreateProd" class="btn-primary">Nuevo Producto</button>
            </div>
        </div>

        <div v-if="pendingProd" class="loading-overlay">Cargando inventario...</div>

        <div v-else>
            <InventoryTable title="Administrar Productos" :headers="['Producto', 'SKU', 'Precio', 'Stock', 'Acciones']">
                <tr v-for="prod in productos" :key="prod.id">
                    <td>{{ prod.nombre }}</td>
                    <td>{{ prod.sku }}</td>
                    <td>${{ prod.precio }}</td>
                    <td>{{ prod.stock }}</td>
                    <td>
                        <button @click="openEditProd(prod)" style="margin-right: 5px; cursor: pointer;">✏️</button>
                        <button @click="borrarProducto(prod.id)" style="color: red; cursor: pointer;">🗑️</button>
                    </td>
                </tr>
            </InventoryTable>
        </div>

        <BaseModal v-model="showModalCat" title="Nueva Categoría">
            <form @submit.prevent="saveCategoria" class="form-grid">
                <input v-model="formCat.nombre" placeholder="Nombre" required class="input-field">
                <textarea v-model="formCat.descripcion" placeholder="Descripción" class="input-field"></textarea>
                <button type="submit" class="btn-primary" :disabled="loading">Guardar Categoría</button>
            </form>
        </BaseModal>

        <BaseModal v-model="showModalProd" :title="editMode ? 'Editar Producto' : 'Nuevo Producto'">
            <form @submit.prevent="saveProducto" class="form-grid">
                <input v-model="formProd.nombre" placeholder="Nombre" required class="input-field">
                <input v-model.number="formProd.precio" type="number" step="0.01" placeholder="Precio" required
                    class="input-field">
                <input v-model.number="formProd.stock" type="number" placeholder="Stock" required class="input-field">
                <input v-model="formProd.sku" placeholder="SKU" required class="input-field">
                <select v-model="formProd.categoriaId" required class="input-field">
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
const { getCategorias, getProductos, createCategoria, createProducto, updateProducto, deleteProducto } = useInventario()

const loading = ref(false)
const showModalCat = ref(false)
const showModalProd = ref(false)
const editMode = ref(false)
const selectedProdId = ref(null)

const formCat = reactive({ nombre: '', descripcion: '' })
const formProd = reactive({ nombre: '', precio: 0, stock: 0, sku: '', categoriaId: '' })

const { data: categorias } = getCategorias()
const { data: productos, pending: pendingProd, refresh: refreshProd } = getProductos()

// Reset y abrir modales
const openCreateCat = () => { Object.assign(formCat, { nombre: '', descripcion: '' }); showModalCat.value = true; }
const openCreateProd = () => {
    Object.assign(formProd, { nombre: '', precio: 0, stock: 0, sku: '', categoriaId: '' })
    editMode.value = false; showModalProd.value = true;
}

// Llenar datos para editar
const openEditProd = (prod) => {
    Object.assign(formProd, { nombre: prod.nombre, precio: prod.precio, stock: prod.stock, sku: prod.sku, categoriaId: prod.categoriaId })
    selectedProdId.value = prod.id
    editMode.value = true
    showModalProd.value = true
}

const saveCategoria = async () => {
    loading.value = true
    try {
        await createCategoria(formCat); showModalCat.value = false;
    } catch (e) { console.error(e) } finally { loading.value = false }
}

const saveProducto = async () => {
    loading.value = true
    try {
        if (editMode.value) {
            await updateProducto(selectedProdId.value, formProd)
        } else {
            await createProducto(formProd)
        }
        await refreshProd()
        showModalProd.value = false
    } catch (e) { alert('Error al guardar'); console.error(e) } finally { loading.value = false }
}

const borrarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
        await deleteProducto(id)
        await refreshProd()
    } catch (e) { alert('Error al eliminar'); console.error(e) }
}
</script>