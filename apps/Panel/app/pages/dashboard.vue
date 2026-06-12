<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'
import { useAnalytics, type DashboardStats } from '~/composables/useAnalytics'

definePageMeta({ layout: 'dashboard' })

const { getDashboardStats } = useAnalytics()

const dashboardData = ref<DashboardStats>({
  totalProductos: 0,
  valorTotal: 0,
  lowStockCount: 0,
  lowStockProducts: [],
  valorPorCategoria: [],
  movimientosHoy: 0,
  ultimosMovimientos: []
})

const stats = computed(() => [
  { label: 'Total Productos', value: dashboardData.value.totalProductos, icon: 'i-lucide-package' },
  { label: 'Stock Bajo', value: dashboardData.value.lowStockCount, icon: 'i-lucide-alert-triangle' },
  { label: 'Movimientos Hoy', value: dashboardData.value.movimientosHoy, icon: 'i-lucide-arrow-left-right' },
  { label: 'Valor Total', value: `€${dashboardData.value.valorTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, icon: 'i-lucide-euro' },
])

onMounted(async () => {
  try {
    const data: any = await getDashboardStats()
    if (data && data.inventario) {
      dashboardData.value = {
        totalProductos: data.inventario.totalProductos || 0,
        valorTotal: data.inventario.valorTotal || 0,
        lowStockCount: data.inventario.lowStockCount || 0,
        lowStockProducts: data.inventario.lowStockProducts || [],
        valorPorCategoria: data.inventario.valorPorCategoria || [],
        movimientosHoy: data.logistica?.movimientosHoy || 0,
        ultimosMovimientos: data.logistica?.ultimosMovimientos || []
      }
    }
  } catch (e) {
    console.error('Error fetching dashboard stats:', e)
  }
})

const movementColumns = [
  { accessorKey: 'id_producto', header: 'ID Producto' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'cantidad', header: 'Cantidad' },
  { accessorKey: 'fecha_movimiento', header: 'Fecha' },
]

const lowStockColumns = [
  { accessorKey: 'nombre', header: 'Producto' },
  { accessorKey: 'stock', header: 'Stock Actual' },
  { accessorKey: 'stockMinimo', header: 'Stock Minimo' },
  { accessorKey: 'categoria.nombre', header: 'Categoria' },
  { id: 'actions', header: '' },
]

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Producto" to="/productos?new=true" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard v-for="stat in stats" :key="stat.label" class="relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-muted">{{ stat.label }}</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ stat.value }}</p>
              </div>
              <div class="rounded-lg bg-primary/10 p-2">
                <UIcon :name="stat.icon" class="size-6 text-primary" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Tables Section -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Recent Movements -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-default">Movimientos Recientes</h3>
                <UButton variant="ghost" size="sm" label="Ver todos" to="/movimientos" />
              </div>
            </template>

            <UTable :data="dashboardData.ultimosMovimientos" :columns="movementColumns">
              <template #tipo-cell="{ row }">
                <UBadge
                  :color="row.original.tipo === 'ENTRADA' ? 'success' : 'warning'"
                  :label="row.original.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'"
                  variant="subtle"
                />
              </template>
              <template #cantidad-cell="{ row }">
                <span :class="row.original.tipo === 'ENTRADA' ? 'text-emerald-500' : 'text-amber-500'">
                  {{ row.original.tipo === 'ENTRADA' ? '+' : '-' }}{{ row.original.cantidad }}
                </span>
              </template>
              <template #fecha_movimiento-cell="{ row }">
                <span>{{ new Date(row.original.fecha_movimiento).toLocaleDateString() }}</span>
              </template>
            </UTable>
          </UCard>

          <!-- Low Stock Alert -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-alert-triangle" class="size-5 text-amber-500" />
                  <h3 class="text-lg font-semibold text-default">Productos con Stock Bajo</h3>
                </div>
                <UButton variant="ghost" size="sm" label="Ver todos" to="/stock" />
              </div>
            </template>

            <UTable :data="dashboardData.lowStockProducts" :columns="lowStockColumns">
              <template #stock-cell="{ row }">
                <UBadge color="error" :label="String(row.original.stock)" variant="subtle" />
              </template>
              <template #actions-cell="{ row }">
                <UButton
                  icon="i-lucide-shopping-cart"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  title="Crear orden de compra"
                />
              </template>
            </UTable>
          </UCard>
        </div>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-default">Acciones Rapidas</h3>
          </template>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <UButton
              icon="i-lucide-package-plus"
              label="Registrar Entrada"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
              to="/movimientos?action=entrada"
            />
            <UButton
              icon="i-lucide-package-minus"
              label="Registrar Salida"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
              to="/movimientos?action=salida"
            />
            <UButton
              icon="i-lucide-arrow-right-left"
              label="Transferencia"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
              to="/movimientos?action=transferencia"
            />
            <UButton
              icon="i-lucide-file-text"
              label="Generar Reporte"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
              to="/reportes"
            />
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

</template>
