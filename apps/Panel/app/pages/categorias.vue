<script setup lang="ts">
import { useCategorias, type Categoria } from '~/composables/useCategorias'
import { useProducts, type Product } from '~/composables/useProducts'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const isEditMode = ref(false)
const searchQuery = ref('')

const { getCategorias, createCategoria, updateCategoria, deleteCategoria: removeCategoria } = useCategorias()
const { getProducts } = useProducts()

const categories = ref<Categoria[]>([])
const products = ref<Product[]>([])

onMounted(async () => {
  try {
    const [dataCategorias, dataProducts] = await Promise.all([
      getCategorias(),
      getProducts()
    ])
    if (dataCategorias) categories.value = dataCategorias
    if (dataProducts) products.value = dataProducts
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
})

const currentCategory = ref<Partial<Categoria>>({
  nombre: '',
  descripcion: '',
  activo: true,
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  return categories.value.filter(cat => {
    const nameMatch = cat.nombre ? cat.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const descMatch = cat.descripcion ? cat.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    return nameMatch || descMatch
  })
})

function openNewModal() {
  isEditMode.value = false
  currentCategory.value = {
    nombre: '',
    descripcion: '',
    activo: true,
  }
  isModalOpen.value = true
}

function openEditModal(category: Categoria) {
  isEditMode.value = true
  currentCategory.value = { ...category }
  isModalOpen.value = true
}

async function saveCategory() {
  try {
    const payload = {
      nombre: currentCategory.value.nombre,
      descripcion: currentCategory.value.descripcion || ''
    }

    if (isEditMode.value && currentCategory.value.id) {
      const updated = await updateCategoria(currentCategory.value.id, payload)
      const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
      if (index !== -1 && updated) {
        categories.value[index] = updated
      }
      toast.add({ title: 'Categoria actualizada', icon: 'i-lucide-check', color: 'success' })
    } else {
      const created = await createCategoria(payload)
      if (created) {
        categories.value.push(created)
      }
      toast.add({ title: 'Categoria creada', icon: 'i-lucide-check', color: 'success' })
    }
    isModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando categoría:', error)
    toast.add({ title: 'Error al guardar categoria', description: error.message, color: 'error' })
  }
}

async function deleteCategory(id: string) {
  try {
    await removeCategoria(id)
    categories.value = categories.value.filter(c => c.id !== id)
    toast.add({ title: 'Categoria eliminada', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar categoria', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Categorias">
        <template #right>
          <div class="hidden sm:flex gap-2 items-center">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Buscar categorias..."
              class="w-64"
            />
            <UButton icon="i-lucide-plus" label="Nueva Categoria" @click="openNewModal" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="sm:hidden">
        <template #right>
          <div class="flex w-full overflow-x-auto gap-2 pb-1">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Buscar..."
              class="w-48 shrink-0"
            />
            <UButton icon="i-lucide-plus" label="Nueva" @click="openNewModal" class="shrink-0" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <UCard
            v-for="category in filteredCategories"
            :key="category.id"
            class="cursor-pointer transition-all hover:shadow-lg"
          >
            <div class="flex items-start justify-between">
              <div class="rounded-lg bg-blue-500/10 p-3">
                <UIcon name="i-lucide-box" class="size-6 text-blue-500" />
              </div>
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(category) },
                    { label: 'Ver productos', icon: 'i-lucide-package', to: `/productos?category=${category.id}` },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteCategory(category.id) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-default">{{ category.nombre }}</h3>
              <p class="mt-1 text-sm text-muted line-clamp-2">{{ category.descripcion || 'Sin descripción' }}</p>
            </div>
            <div class="mt-4 flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-primary transition-colors" @click.stop="navigateTo(`/productos?category=${category.id}`)">
              <UIcon name="i-lucide-package" class="size-4" />
              <span>{{ products.filter(p => p.categoria?.id === category.id).length }} productos</span>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Category Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Categoria' : 'Nueva Categoria'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre" name="nombre">
          <UInput v-model="currentCategory.nombre" placeholder="Nombre de la categoria" />
        </UFormField>

        <UFormField label="Descripcion" name="descripcion">
          <UTextarea v-model="currentCategory.descripcion" placeholder="Descripcion de la categoria" :rows="3" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Categoria'" @click="saveCategory" />
      </div>
    </template>
  </UModal>
</template>
