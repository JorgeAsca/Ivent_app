<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const isEditMode = ref(false)
const searchQuery = ref('')

interface Supplier {
  id: number
  code: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  category: string
  status: 'active' | 'inactive'
  totalOrders: number
  totalAmount: number
}

const suppliers = ref<Supplier[]>([
  { id: 1, code: 'PRV-001', name: 'Distribuidora ABC', contact: 'Juan Perez', email: 'juan@distribuidoraabc.com', phone: '+34 612 345 678', address: 'Calle Mayor 123, Madrid', category: 'Alimentos', status: 'active', totalOrders: 45, totalAmount: 12500 },
  { id: 2, code: 'PRV-002', name: 'Lacteos del Norte', contact: 'Maria Garcia', email: 'maria@lacteosnorte.com', phone: '+34 623 456 789', address: 'Av. Industrial 456, Barcelona', category: 'Lacteos', status: 'active', totalOrders: 32, totalAmount: 8900 },
  { id: 3, code: 'PRV-003', name: 'Aceites Premium', contact: 'Carlos Lopez', email: 'carlos@aceitespremium.com', phone: '+34 634 567 890', address: 'Poligono Sur 789, Sevilla', category: 'Aceites', status: 'active', totalOrders: 18, totalAmount: 15600 },
  { id: 4, code: 'PRV-004', name: 'Carnes Selectas', contact: 'Ana Martinez', email: 'ana@carnesselectas.com', phone: '+34 645 678 901', address: 'Calle Nueva 321, Valencia', category: 'Carnes', status: 'active', totalOrders: 28, totalAmount: 22400 },
  { id: 5, code: 'PRV-005', name: 'Verduras Frescas', contact: 'Pedro Sanchez', email: 'pedro@verdurasfrescas.com', phone: '+34 656 789 012', address: 'Mercado Central, Bilbao', category: 'Verduras', status: 'inactive', totalOrders: 12, totalAmount: 3200 },
])

const currentSupplier = ref<Partial<Supplier>>({
  code: '',
  name: '',
  contact: '',
  email: '',
  phone: '',
  address: '',
  category: '',
  status: 'active',
})

const categoryOptions = ['Alimentos', 'Lacteos', 'Aceites', 'Carnes', 'Verduras', 'Bebidas', 'Especias', 'Otros']

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  return suppliers.value.filter(sup =>
    sup.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sup.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sup.contact.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const columns = [
  { accessorKey: 'code', header: 'Codigo' },
  { accessorKey: 'name', header: 'Proveedor' },
  { accessorKey: 'contact', header: 'Contacto' },
  { accessorKey: 'category', header: 'Categoria' },
  { accessorKey: 'totalOrders', header: 'Pedidos' },
  { accessorKey: 'totalAmount', header: 'Total Compras' },
  { accessorKey: 'status', header: 'Estado' },
  { id: 'actions', header: '' },
]

function openNewModal() {
  isEditMode.value = false
  currentSupplier.value = {
    code: `PRV-${String(suppliers.value.length + 1).padStart(3, '0')}`,
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'active',
  }
  isModalOpen.value = true
}

function openEditModal(supplier: Supplier) {
  isEditMode.value = true
  currentSupplier.value = { ...supplier }
  isModalOpen.value = true
}

function saveSupplier() {
  if (isEditMode.value) {
    const index = suppliers.value.findIndex(s => s.id === currentSupplier.value.id)
    if (index !== -1) {
      suppliers.value[index] = currentSupplier.value as Supplier
    }
    toast.add({ title: 'Proveedor actualizado', icon: 'i-lucide-check', color: 'success' })
  } else {
    const newSupplier: Supplier = {
      ...currentSupplier.value as Supplier,
      id: Date.now(),
      totalOrders: 0,
      totalAmount: 0,
    }
    suppliers.value.push(newSupplier)
    toast.add({ title: 'Proveedor creado', icon: 'i-lucide-check', color: 'success' })
  }
  isModalOpen.value = false
}

function deleteSupplier(id: number) {
  suppliers.value = suppliers.value.filter(s => s.id !== id)
  toast.add({ title: 'Proveedor eliminado', icon: 'i-lucide-trash', color: 'warning' })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Proveedores">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Proveedor" @click="openNewModal" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar proveedores..."
            class="w-64"
          />
        </template>
        <template #right>
          <UButton icon="i-lucide-download" label="Exportar" variant="outline" color="neutral" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <UCard>
          <UTable :data="filteredSuppliers" :columns="columns">
            <template #code-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.code }}</span>
            </template>
            <template #name-cell="{ row }">
              <div>
                <span class="font-medium text-default">{{ row.original.name }}</span>
                <p class="text-xs text-muted">{{ row.original.email }}</p>
              </div>
            </template>
            <template #contact-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.contact }}</span>
                <p class="text-xs text-muted">{{ row.original.phone }}</p>
              </div>
            </template>
            <template #totalAmount-cell="{ row }">
              <span class="font-semibold text-default">${{ row.original.totalAmount.toLocaleString() }}</span>
            </template>
            <template #status-cell="{ row }">
              <UBadge
                :color="row.original.status === 'active' ? 'success' : 'neutral'"
                :label="row.original.status === 'active' ? 'Activo' : 'Inactivo'"
                variant="subtle"
              />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(row.original) },
                    { label: 'Ver detalles', icon: 'i-lucide-eye' },
                    { label: 'Ver pedidos', icon: 'i-lucide-shopping-cart' },
                  ],
                  [
                    { label: 'Crear pedido', icon: 'i-lucide-plus' },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteSupplier(row.original.id) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Supplier Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Proveedor' : 'Nuevo Proveedor'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Codigo" name="code">
            <UInput v-model="currentSupplier.code" :disabled="isEditMode" />
          </UFormField>
          <UFormField label="Categoria" name="category">
            <USelectMenu v-model="currentSupplier.category" :items="categoryOptions" placeholder="Seleccionar" />
          </UFormField>
        </div>

        <UFormField label="Nombre de la Empresa" name="name">
          <UInput v-model="currentSupplier.name" placeholder="Nombre del proveedor" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Persona de Contacto" name="contact">
            <UInput v-model="currentSupplier.contact" placeholder="Nombre del contacto" />
          </UFormField>
          <UFormField label="Telefono" name="phone">
            <UInput v-model="currentSupplier.phone" placeholder="+34 600 000 000" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput v-model="currentSupplier.email" type="email" placeholder="email@proveedor.com" />
        </UFormField>

        <UFormField label="Direccion" name="address">
          <UTextarea v-model="currentSupplier.address" placeholder="Direccion completa" :rows="2" />
        </UFormField>

        <UFormField label="Estado" name="status">
          <URadioGroup
            v-model="currentSupplier.status"
            :items="[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]"
            orientation="horizontal"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Proveedor'" @click="saveSupplier" />
      </div>
    </template>
  </UModal>
</template>
