<template>
    <div>
        <div class="header-actions">
            <h2>Gestión de Categorías</h2>
        </div>

        <div v-if="pendingCat" class="loading-overlay">Cargando categorías...</div>

        <div v-else>
            <InventoryTable title="Administrar Categorías" :headers="['Nombre', 'Descripción', 'Acciones']"
                @add="openCreateCat">
                <tr v-for="cat in categorias" :key="cat.id">
                    <td>{{ cat.nombre }}</td>
                    <td>{{ cat.descripcion || 'Sin descripción' }}</td>
                    <td>
                        <button @click="openEditCat(cat)" style="margin-right: 5px; cursor: pointer;">✏️</button>
                        <button @click="borrarCategoria(cat.id)" style="color: red; cursor: pointer;">🗑️</button>
                    </td>
                </tr>
            </InventoryTable>
        </div>

        <BaseModal v-model="showModalCat" :title="editMode ? 'Editar Categoría' : 'Nueva Categoría'">
            <form @submit.prevent="saveCategoria" class="form-grid">
                <input v-model="formCat.nombre" placeholder="Nombre" required class="input-field">
                <textarea v-model="formCat.descripcion" placeholder="Descripción" class="input-field"></textarea>
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear') }}
                </button>
            </form>
        </BaseModal>
    </div>
</template>

<script setup>
const { getCategorias, createCategoria, updateCategoria, deleteCategoria } = useInventario()

const loading = ref(false)
const showModalCat = ref(false)
const editMode = ref(false)
const selectedCatId = ref(null)

const formCat = reactive({ nombre: '', descripcion: '' })

const { data: categorias, pending: pendingCat, refresh: refreshCat } = getCategorias()

const openCreateCat = () => {
    Object.assign(formCat, { nombre: '', descripcion: '' })
    editMode.value = false; showModalCat.value = true;
}

const openEditCat = (cat) => {
    Object.assign(formCat, { nombre: cat.nombre, descripcion: cat.descripcion || '' })
    selectedCatId.value = cat.id; editMode.value = true; showModalCat.value = true;
}

const saveCategoria = async () => {
    loading.value = true
    try {
        if (editMode.value) await updateCategoria(selectedCatId.value, formCat)
        else await createCategoria(formCat)
        await refreshCat()
        showModalCat.value = false
    } catch (e) { alert('Error al guardar'); console.error(e) } finally { loading.value = false }
}

const borrarCategoria = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Si tiene productos asociados podría fallar.')) return
    try { await deleteCategoria(id); await refreshCat(); } catch (e) { alert('Error al eliminar'); }
}
</script>