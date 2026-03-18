<script setup lang="ts">
import type { Producto } from '~/types'

const search = ref('')

// Fetch a la API interna que conecta con la VPS
const { data: productos, pending, error, refresh } = await useFetch<Producto[]>('/api/inventario/productos')

// Filtrado reactivo
const filteredRows = computed(() => {
  if (!search.value) return productos.value || []
  return (productos.value || []).filter((p) =>
    p.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.value.toLowerCase())
  )
})

import type { TableColumn } from '@nuxt/ui'

const columns: TableColumn<Producto>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'nombre', header: 'Producto', enableSorting: true },
  { accessorKey: 'precio', header: 'Precio', enableSorting: true },
  { accessorKey: 'stock', header: 'Existencias', enableSorting: true },
  { id: 'actions', header: 'Acciones' }
]
</script>

<template>
  <UContainer class="admin-page-container">
    <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="admin-header-title">Inventario de Productos</h1>
        <p class="admin-header-desc">Monitoreo de stock y precios sincronizado con la VPS.</p>
      </div>
      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por nombre o SKU..."
          class="w-72"
          size="md"
        />
        <AddProductoModal @success="refresh" />
      </div>
    </header>

    <UCard class="admin-card-table">
      <UTable
        :data="filteredRows"
        :columns="columns"
        :loading="pending"
      >
        <template #nombre-cell="{ row }">
          <div class="product-name-text">{{ row.original.nombre }}</div>
        </template>

        <template #precio-cell="{ row }">
          <span class="price-text">
            ${{ Number(row.original.precio).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </span>
        </template>

        <template #stock-cell="{ row }">
          <UBadge
            :color="row.original.stock <= 5 ? 'warning' : 'success'"
            variant="subtle"
            size="xs"
            icon="i-lucide-box"
          >
            {{ row.original.stock }} unidades
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-1">
            <UTooltip text="Editar">
              <UButton icon="i-lucide-edit" variant="ghost" color="primary" size="sm" />
            </UTooltip>
            <UTooltip text="Eliminar">
              <UButton icon="i-lucide-trash" variant="ghost" color="error" size="sm" />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>
