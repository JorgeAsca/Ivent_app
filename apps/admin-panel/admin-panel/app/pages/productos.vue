<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Producto } from '~/types'

// fetch a la API interna que conecta con el ms-gateway
// IMPORTANTE: El archivo en server/api debe llamarse inventario.get.ts
const { data: productos, pending, error } = await useFetch<Producto[]>('/api/inventario')

const columns: TableColumn<Producto>[] = [
  { accessorKey: 'nombre', header: 'Producto' },
  {
    accessorKey: 'precio',
    header: 'Precio',
    cell: ({ row }) => {
      const valor = row.original.precio
      return typeof valor === 'number' ? `$${valor.toFixed(2)}` : '$0.00'
    }
  },
  { accessorKey: 'stock', header: 'Stock' }
]
</script>

<template>
  <UContainer class="py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Productos</h1>
      <AddProductoModal />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      title="Error de Microservicios"
      :description="error.statusMessage || 'No se pudo conectar con el Gateway'"
    />

    <UTable
      :data="productos || []"
      :columns="columns"
      :loading="pending"
      class="border rounded-lg"
    />
  </UContainer>
</template>
