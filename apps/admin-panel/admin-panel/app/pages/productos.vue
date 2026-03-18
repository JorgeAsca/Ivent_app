<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Producto } from '~/types'

const { data: productos, pending, error, refresh } = await useFetch<Producto[]>('/api/inventario')

const columns: TableColumn<Producto>[] = [
  { accessorKey: 'nombre', header: 'Producto', enableSorting: true },
  { accessorKey: 'precio', header: 'Precio' },
  { accessorKey: 'stock', header: 'Stock' },
  { id: 'actions', header: 'Acciones' }
]
</script>

<template>
  <UContainer class="py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
      <AddProductoModal @success="refresh" />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      title="Error de Conexión"
      description="No se pudo conectar con el servicio de inventario."
    />

    <UTable
      :data="productos || []"
      :columns="columns"
      :loading="pending"
      class="border rounded-lg bg-white dark:bg-gray-900"
    >
      <template #nombre-cell="{ row }">
        <span class="font-semibold text-blue-600 dark:text-blue-400">
          {{ row.original.nombre }}
        </span>
      </template>

      <template #precio-cell="{ row }">
        <span class="text-green-600 dark:text-green-400 font-medium">
          ${{ Number(row.original.precio).toFixed(2) }}
        </span>
      </template>

      <template #stock-cell="{ row }">
        <UBadge
          :color="row.original.stock <= 5 ? 'warning' : 'success'"
          variant="subtle"
          size="xs"
        >
          {{ row.original.stock }} uds
        </UBadge>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton icon="i-lucide-edit" size="xs" color="primary" variant="ghost" />
          <UButton icon="i-lucide-trash" size="xs" color="error" variant="ghost" />
        </div>
      </template>
    </UTable>
  </UContainer>
</template>
