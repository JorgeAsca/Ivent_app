<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const isEditMode = ref(false)

interface Warehouse {
  id: number
  code: string
  name: string
  type: 'general' | 'refrigerado' | 'congelados' | 'materia_prima'
  address: string
  manager: string
  capacity: number
  usedCapacity: number
  productCount: number
  status: 'active' | 'maintenance' | 'inactive'
}

const warehouses = ref<Warehouse[]>([
  { id: 1, code: 'ALM-001', name: 'Almacen Principal', type: 'general', address: 'Calle Industrial 123', manager: 'Carlos Rodriguez', capacity: 1000, usedCapacity: 650, productCount: 245, status: 'active' },
  { id: 2, code: 'ALM-002', name: 'Refrigerado', type: 'refrigerado', address: 'Calle Industrial 123', manager: 'Ana Lopez', capacity: 300, usedCapacity: 210, productCount: 82, status: 'active' },
  { id: 3, code: 'ALM-003', name: 'Congelados', type: 'congelados', address: 'Calle Industrial 125', manager: 'Pedro Martinez', capacity: 200, usedCapacity: 85, productCount: 34, status: 'active' },
  { id: 4, code: 'ALM-004', name: 'Materia Prima', type: 'materia_prima', address: 'Calle Industrial 127', manager: 'Laura Sanchez', capacity: 500, usedCapacity: 320, productCount: 156, status: 'active' },
  { id: 5, code: 'ALM-005', name: 'Cocina Central', type: 'general', address: 'Av. Gastronomica 45', manager: 'Miguel Torres', capacity: 150, usedCapacity: 120, productCount: 48, status: 'maintenance' },
])

const currentWarehouse = ref<Partial<Warehouse>>({
  code: '',
  name: '',
  type: 'general',
  address: '',
  manager: '',
  capacity: 0,
  status: 'active',
})

const typeOptions = [
  { value: 'general', label: 'General', icon: 'i-lucide-warehouse' },
  { value: 'refrigerado', label: 'Refrigerado', icon: 'i-lucide-thermometer-snowflake' },
  { value: 'congelados', label: 'Congelados', icon: 'i-lucide-snowflake' },
  { value: 'materia_prima', label: 'Materia Prima', icon: 'i-lucide-boxes' },
]

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'maintenance', label: 'En Mantenimiento' },
  { value: 'inactive', label: 'Inactivo' },
]

function getTypeInfo(type: string) {
  switch (type) {
    case 'general': return { label: 'General', icon: 'i-lucide-warehouse', color: 'emerald' }
    case 'refrigerado': return { label: 'Refrigerado', icon: 'i-lucide-thermometer-snowflake', color: 'blue' }
    case 'congelados': return { label: 'Congelados', icon: 'i-lucide-snowflake', color: 'cyan' }
    case 'materia_prima': return { label: 'Materia Prima', icon: 'i-lucide-boxes', color: 'amber' }
    default: return { label: type, icon: 'i-lucide-warehouse', color: 'neutral' }
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'success'
    case 'maintenance': return 'warning'
    case 'inactive': return 'neutral'
    default: return 'neutral'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'Activo'
    case 'maintenance': return 'Mantenimiento'
    case 'inactive': return 'Inactivo'
    default: return status
  }
}

function getCapacityPercentage(warehouse: Warehouse) {
  return Math.round((warehouse.usedCapacity / warehouse.capacity) * 100)
}

function getCapacityColor(percentage: number) {
  if (percentage >= 90) return 'error'
  if (percentage >= 70) return 'warning'
  return 'success'
}

function openNewModal() {
  isEditMode.value = false
  currentWarehouse.value = {
    code: `ALM-${String(warehouses.value.length + 1).padStart(3, '0')}`,
    name: '',
    type: 'general',
    address: '',
    manager: '',
    capacity: 0,
    status: 'active',
  }
  isModalOpen.value = true
}

function openEditModal(warehouse: Warehouse) {
  isEditMode.value = true
  currentWarehouse.value = { ...warehouse }
  isModalOpen.value = true
}

function saveWarehouse() {
  if (isEditMode.value) {
    const index = warehouses.value.findIndex(w => w.id === currentWarehouse.value.id)
    if (index !== -1) {
      warehouses.value[index] = currentWarehouse.value as Warehouse
    }
    toast.add({ title: 'Almacen actualizado', icon: 'i-lucide-check', color: 'success' })
  } else {
    const newWarehouse: Warehouse = {
      ...currentWarehouse.value as Warehouse,
      id: Date.now(),
      usedCapacity: 0,
      productCount: 0,
    }
    warehouses.value.push(newWarehouse)
    toast.add({ title: 'Almacen creado', icon: 'i-lucide-check', color: 'success' })
  }
  isModalOpen.value = false
}

function deleteWarehouse(id: number) {
  warehouses.value = warehouses.value.filter(w => w.id !== id)
  toast.add({ title: 'Almacen eliminado', icon: 'i-lucide-trash', color: 'warning' })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Almacenes">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Almacen" @click="openNewModal" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Summary Stats -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-emerald-500/10 p-2">
                <UIcon name="i-lucide-warehouse" class="size-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Total Almacenes</p>
                <p class="text-xl font-semibold text-default">{{ warehouses.length }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-500/10 p-2">
                <UIcon name="i-lucide-package" class="size-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Productos Totales</p>
                <p class="text-xl font-semibold text-default">{{ warehouses.reduce((sum, w) => sum + w.productCount, 0) }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-amber-500/10 p-2">
                <UIcon name="i-lucide-ruler" class="size-5 text-amber-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Capacidad Total</p>
                <p class="text-xl font-semibold text-default">{{ warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString() }} m3</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-purple-500/10 p-2">
                <UIcon name="i-lucide-percent" class="size-5 text-purple-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Ocupacion Media</p>
                <p class="text-xl font-semibold text-default">{{ Math.round(warehouses.reduce((sum, w) => sum + getCapacityPercentage(w), 0) / warehouses.length) }}%</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Warehouse Cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <UCard v-for="warehouse in warehouses" :key="warehouse.id">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="`rounded-lg bg-${getTypeInfo(warehouse.type).color}-500/10 p-3`">
                  <UIcon :name="getTypeInfo(warehouse.type).icon" :class="`size-6 text-${getTypeInfo(warehouse.type).color}-500`" />
                </div>
                <div>
                  <h3 class="font-semibold text-default">{{ warehouse.name }}</h3>
                  <p class="text-sm text-muted">{{ warehouse.code }}</p>
                </div>
              </div>
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(warehouse) },
                    { label: 'Ver inventario', icon: 'i-lucide-package', to: `/productos?warehouse=${warehouse.name}` },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteWarehouse(warehouse.id) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Tipo</span>
                <UBadge :label="getTypeInfo(warehouse.type).label" variant="subtle" color="neutral" />
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Estado</span>
                <UBadge :label="getStatusLabel(warehouse.status)" :color="getStatusColor(warehouse.status)" variant="subtle" />
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Responsable</span>
                <span class="text-default">{{ warehouse.manager }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Productos</span>
                <span class="font-semibold text-default">{{ warehouse.productCount }}</span>
              </div>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-muted">Capacidad</span>
                <span :class="`font-semibold text-${getCapacityColor(getCapacityPercentage(warehouse))}`">
                  {{ getCapacityPercentage(warehouse) }}%
                </span>
              </div>
              <UProgress
                :value="getCapacityPercentage(warehouse)"
                :color="getCapacityColor(getCapacityPercentage(warehouse))"
                size="sm"
              />
              <p class="mt-1 text-xs text-muted">
                {{ warehouse.usedCapacity }} / {{ warehouse.capacity }} m3
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Warehouse Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Almacen' : 'Nuevo Almacen'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Codigo" name="code">
            <UInput v-model="currentWarehouse.code" :disabled="isEditMode" />
          </UFormField>
          <UFormField label="Tipo" name="type">
            <USelectMenu
              v-model="currentWarehouse.type"
              :items="typeOptions"
              value-key="value"
              placeholder="Seleccionar tipo"
            />
          </UFormField>
        </div>

        <UFormField label="Nombre" name="name">
          <UInput v-model="currentWarehouse.name" placeholder="Nombre del almacen" />
        </UFormField>

        <UFormField label="Direccion" name="address">
          <UInput v-model="currentWarehouse.address" placeholder="Direccion del almacen" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Responsable" name="manager">
            <UInput v-model="currentWarehouse.manager" placeholder="Nombre del responsable" />
          </UFormField>
          <UFormField label="Capacidad (m3)" name="capacity">
            <UInput v-model.number="currentWarehouse.capacity" type="number" min="0" />
          </UFormField>
        </div>

        <UFormField label="Estado" name="status">
          <URadioGroup
            v-model="currentWarehouse.status"
            :items="statusOptions"
            orientation="horizontal"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Almacen'" @click="saveWarehouse" />
      </div>
    </template>
  </UModal>
</template>
