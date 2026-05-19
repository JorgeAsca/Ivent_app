<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const searchQuery = ref('')
const filterType = ref<string | undefined>(undefined)
const filterWarehouse = ref<string | undefined>(undefined)

interface Movement {
  id: number
  date: string
  time: string
  type: 'entrada' | 'salida' | 'ajuste' | 'transferencia'
  product: string
  productSku: string
  quantity: number
  warehouse: string
  warehouseTo?: string
  reference: string
  notes: string
  user: string
}

const movements = ref<Movement[]>([
  { id: 1, date: '2024-01-15', time: '09:30', type: 'entrada', product: 'Harina de Trigo 1kg', productSku: 'HAR-001', quantity: 50, warehouse: 'Almacen Principal', reference: 'OC-2024-001', notes: 'Compra a Proveedor ABC', user: 'Admin' },
  { id: 2, date: '2024-01-15', time: '10:15', type: 'salida', product: 'Salsa de Tomate 500ml', productSku: 'SAL-001', quantity: 30, warehouse: 'Almacen Principal', reference: 'PED-2024-042', notes: 'Venta a cliente', user: 'Admin' },
  { id: 3, date: '2024-01-15', time: '11:00', type: 'entrada', product: 'Queso Mozzarella 500g', productSku: 'QUE-001', quantity: 25, warehouse: 'Refrigerado', reference: 'OC-2024-002', notes: 'Compra a Lacteos del Norte', user: 'Admin' },
  { id: 4, date: '2024-01-15', time: '14:30', type: 'transferencia', product: 'Aceite de Oliva 1L', productSku: 'ACE-001', quantity: 15, warehouse: 'Almacen Principal', warehouseTo: 'Cocina', reference: 'TRF-2024-008', notes: 'Transferencia interna', user: 'Admin' },
  { id: 5, date: '2024-01-14', time: '16:00', type: 'ajuste', product: 'Oregano 100g', productSku: 'ORE-001', quantity: -5, warehouse: 'Almacen Principal', reference: 'AJU-2024-003', notes: 'Ajuste por inventario fisico', user: 'Admin' },
  { id: 6, date: '2024-01-14', time: '09:00', type: 'entrada', product: 'Levadura Fresca', productSku: 'LEV-001', quantity: 100, warehouse: 'Refrigerado', reference: 'OC-2024-003', notes: 'Reposicion de stock', user: 'Admin' },
  { id: 7, date: '2024-01-13', time: '11:30', type: 'salida', product: 'Jamon Serrano', productSku: 'JAM-001', quantity: 8, warehouse: 'Refrigerado', reference: 'PED-2024-038', notes: 'Pedido restaurante', user: 'Admin' },
])

const currentMovement = ref({
  type: 'entrada' as Movement['type'],
  product: '',
  quantity: 0,
  warehouse: '',
  warehouseTo: '',
  reference: '',
  notes: '',
})

const typeOptions = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
  { value: 'ajuste', label: 'Ajuste' },
  { value: 'transferencia', label: 'Transferencia' },
]

const warehouses = ['Almacen Principal', 'Refrigerado', 'Congelados', 'Cocina']

const products = [
  { value: 'HAR-001', label: 'Harina de Trigo 1kg' },
  { value: 'SAL-001', label: 'Salsa de Tomate 500ml' },
  { value: 'QUE-001', label: 'Queso Mozzarella 500g' },
  { value: 'ACE-001', label: 'Aceite de Oliva 1L' },
  { value: 'LEV-001', label: 'Levadura Fresca' },
  { value: 'JAM-001', label: 'Jamon Serrano' },
  { value: 'ORE-001', label: 'Oregano 100g' },
]

const filteredMovements = computed(() => {
  return movements.value.filter((mov) => {
    const matchesSearch = mov.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mov.reference.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || mov.type === filterType.value
    const matchesWarehouse = !filterWarehouse.value || mov.warehouse === filterWarehouse.value
    return matchesSearch && matchesType && matchesWarehouse
  })
})

const columns = [
  { accessorKey: 'date', header: 'Fecha' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'product', header: 'Producto' },
  { accessorKey: 'quantity', header: 'Cantidad' },
  { accessorKey: 'warehouse', header: 'Almacen' },
  { accessorKey: 'reference', header: 'Referencia' },
  { accessorKey: 'user', header: 'Usuario' },
  { id: 'actions', header: '' },
]

function getTypeColor(type: string) {
  switch (type) {
    case 'entrada': return 'success'
    case 'salida': return 'warning'
    case 'ajuste': return 'info'
    case 'transferencia': return 'primary'
    default: return 'neutral'
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'entrada': return 'i-lucide-package-plus'
    case 'salida': return 'i-lucide-package-minus'
    case 'ajuste': return 'i-lucide-scale'
    case 'transferencia': return 'i-lucide-arrow-right-left'
    default: return 'i-lucide-package'
  }
}

function openNewModal(type: Movement['type']) {
  currentMovement.value = {
    type,
    product: '',
    quantity: 0,
    warehouse: '',
    warehouseTo: '',
    reference: '',
    notes: '',
  }
  isModalOpen.value = true
}

function saveMovement() {
  const product = products.find(p => p.value === currentMovement.value.product)
  const newMovement: Movement = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: currentMovement.value.type,
    product: product?.label || '',
    productSku: currentMovement.value.product,
    quantity: currentMovement.value.type === 'salida' ? -Math.abs(currentMovement.value.quantity) : currentMovement.value.quantity,
    warehouse: currentMovement.value.warehouse,
    warehouseTo: currentMovement.value.warehouseTo || undefined,
    reference: currentMovement.value.reference || `MOV-${Date.now()}`,
    notes: currentMovement.value.notes,
    user: 'Admin',
  }
  movements.value.unshift(newMovement)
  toast.add({ title: 'Movimiento registrado', icon: 'i-lucide-check', color: 'success' })
  isModalOpen.value = false
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Movimientos de Stock">
        <template #right>
          <div class="flex gap-2">
            <UButton icon="i-lucide-package-plus" label="Entrada" color="success" variant="soft" @click="openNewModal('entrada')" />
            <UButton icon="i-lucide-package-minus" label="Salida" color="warning" variant="soft" @click="openNewModal('salida')" />
            <UButton icon="i-lucide-arrow-right-left" label="Transferencia" variant="soft" @click="openNewModal('transferencia')" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar movimientos..."
            class="w-64"
          />
        </template>
        <template #right>
          <div class="flex gap-2">
            <USelectMenu
              v-model="filterType"
              :items="typeOptions"
              value-key="value"
              placeholder="Tipo"
              class="w-40"
            />
            <USelectMenu
              v-model="filterWarehouse"
              :items="warehouses"
              placeholder="Almacen"
              class="w-44"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Summary Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard class="bg-emerald-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-emerald-500/20 p-2">
                <UIcon name="i-lucide-package-plus" class="size-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Entradas Hoy</p>
                <p class="text-xl font-semibold text-default">175</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-amber-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-amber-500/20 p-2">
                <UIcon name="i-lucide-package-minus" class="size-5 text-amber-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Salidas Hoy</p>
                <p class="text-xl font-semibold text-default">38</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-blue-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-500/20 p-2">
                <UIcon name="i-lucide-arrow-right-left" class="size-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Transferencias</p>
                <p class="text-xl font-semibold text-default">12</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-purple-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-purple-500/20 p-2">
                <UIcon name="i-lucide-scale" class="size-5 text-purple-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Ajustes</p>
                <p class="text-xl font-semibold text-default">3</p>
              </div>
            </div>
          </UCard>
        </div>

        <UCard>
          <UTable :data="filteredMovements" :columns="columns">
            <template #date-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.date }}</span>
                <span class="ml-2 text-xs text-muted">{{ row.original.time }}</span>
              </div>
            </template>
            <template #type-cell="{ row }">
              <UBadge
                :color="getTypeColor(row.original.type)"
                :icon="getTypeIcon(row.original.type)"
                :label="row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)"
                variant="subtle"
              />
            </template>
            <template #product-cell="{ row }">
              <div>
                <span class="font-medium text-default">{{ row.original.product }}</span>
                <span class="ml-2 text-xs text-muted">{{ row.original.productSku }}</span>
              </div>
            </template>
            <template #quantity-cell="{ row }">
              <span
                :class="[
                  'font-semibold',
                  row.original.quantity > 0 ? 'text-emerald-500' : 'text-amber-500',
                ]"
              >
                {{ row.original.quantity > 0 ? '+' : '' }}{{ row.original.quantity }}
              </span>
            </template>
            <template #warehouse-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.warehouse }}</span>
                <template v-if="row.original.warehouseTo">
                  <UIcon name="i-lucide-arrow-right" class="mx-1 size-3 text-muted" />
                  <span class="text-default">{{ row.original.warehouseTo }}</span>
                </template>
              </div>
            </template>
            <template #reference-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.reference }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Ver detalles', icon: 'i-lucide-eye' },
                    { label: 'Imprimir', icon: 'i-lucide-printer' },
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

  <!-- Movement Modal -->
  <UModal v-model:open="isModalOpen" :title="`Registrar ${currentMovement.type.charAt(0).toUpperCase() + currentMovement.type.slice(1)}`">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Producto" name="product">
          <USelectMenu
            v-model="currentMovement.product"
            :items="products"
            value-key="value"
            searchable
            placeholder="Buscar producto..."
          />
        </UFormField>

        <UFormField label="Cantidad" name="quantity">
          <UInput v-model.number="currentMovement.quantity" type="number" min="1" />
        </UFormField>

        <UFormField label="Almacen Origen" name="warehouse">
          <USelectMenu
            v-model="currentMovement.warehouse"
            :items="warehouses"
            placeholder="Seleccionar almacen"
          />
        </UFormField>

        <UFormField v-if="currentMovement.type === 'transferencia'" label="Almacen Destino" name="warehouseTo">
          <USelectMenu
            v-model="currentMovement.warehouseTo"
            :items="warehouses.filter(w => w !== currentMovement.warehouse)"
            placeholder="Seleccionar almacen destino"
          />
        </UFormField>

        <UFormField label="Referencia (opcional)" name="reference">
          <UInput v-model="currentMovement.reference" placeholder="Ej: OC-2024-001" />
        </UFormField>

        <UFormField label="Notas" name="notes">
          <UTextarea v-model="currentMovement.notes" placeholder="Notas adicionales..." :rows="2" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton label="Registrar Movimiento" @click="saveMovement" />
      </div>
    </template>
  </UModal>
</template>
