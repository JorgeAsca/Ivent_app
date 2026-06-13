<script setup lang="ts">
import { useProducts, type Product } from '~/composables/useProducts'
import { useMovimientos, type Movimiento } from '~/composables/useMovimientos'
import { useAlmacenes, type Almacen } from '~/composables/useAlmacenes'
import { useCategorias, type Categoria } from '~/composables/useCategorias'
import { useEmpresas } from '~/composables/useEmpresas'
import { useConfiguracion } from '~/composables/useConfiguracion'

import jsPDF from 'jspdf'
import jspdfAutotable from 'jspdf-autotable'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()

const selectedPeriod = ref('month')
const selectedWarehouse = ref<string | undefined>(undefined)

const periodOptions = [
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'quarter', label: 'Este Trimestre' },
  { value: 'year', label: 'Este Año' },
]

const { getProducts } = useProducts()
const { getMovimientos } = useMovimientos()
const { getAlmacenes } = useAlmacenes()
const { getCategorias } = useCategorias()
const { getEmpresas } = useEmpresas()
const { getGlobalConfigs } = useConfiguracion()

const products = ref<Product[]>([])
const globalDefaultMinStock = ref(10)
const movimientos = ref<Movimiento[]>([])
const almacenes = ref<Almacen[]>([])
const categorias = ref<Categoria[]>([])

const isLoading = ref(true)

onMounted(async () => {
  try {
    const empresas = await getEmpresas()
    let empresaId = undefined
    if (empresas && empresas.length > 0) {
      empresaId = empresas[0].id_empresa
    }

    const [prods, movs, alms, cats, configs] = await Promise.all([
      getProducts(),
      getMovimientos(empresaId),
      getAlmacenes(empresaId),
      getCategorias(),
      getGlobalConfigs()
    ])
    
    if (configs) {
      const defaultStockConfig = configs.find((c: any) => c.clave === 'STOCK_MINIMO_DEFECTO')
      if (defaultStockConfig) {
        globalDefaultMinStock.value = parseInt(defaultStockConfig.valor, 10)
      }
    }
    
    if (prods) products.value = prods
    if (movs) movimientos.value = movs
    if (alms) almacenes.value = alms
    if (cats) categorias.value = cats

  } catch (e) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  } finally {
    isLoading.value = false
  }
})

const warehouseOptions = computed(() => {
  return [
    { label: 'Todos los almacenes', value: undefined },
    ...almacenes.value.map(a => ({ label: a.nombre, value: a.id }))
  ]
})

const filteredMovements = computed(() => {
  const now = new Date()
  let startDate = new Date(0)
  
  if (selectedPeriod.value === 'week') {
    startDate = new Date(now)
    startDate.setDate(now.getDate() - now.getDay())
  }
  if (selectedPeriod.value === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }
  if (selectedPeriod.value === 'quarter') {
    startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  }
  if (selectedPeriod.value === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1)
  }

  return movimientos.value.filter(mov => {
    const movDate = new Date(mov.fecha_movimiento)
    const matchesDate = movDate >= startDate
    const matchesWarehouse = !selectedWarehouse.value || mov.id_almacen === selectedWarehouse.value
    
    return matchesDate && matchesWarehouse
  })
})

const inventoryValue = computed(() => {
  let total = 0
  const catTotals: Record<string, number> = {}
  
  products.value.forEach(p => {
    const value = (p.stock || 0) * (p.precio || 0)
    total += value
    
    const catName = p.categoria?.nombre || categorias.value.find(c => c.id === p.categoriaId)?.nombre || 'Otros'
    catTotals[catName] = (catTotals[catName] || 0) + value
  })

  const byCategory = Object.entries(catTotals).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0
  })).sort((a, b) => b.value - a.value)

  return {
    total,
    change: 0, 
    byCategory
  }
})

const movementStats = computed(() => {
  let entriesCount = 0
  let entriesValue = 0
  let exitsCount = 0
  let exitsValue = 0

  filteredMovements.value.forEach(mov => {
    const product = products.value.find(p => p.id === mov.id_producto)
    const value = mov.cantidad * (product?.precio || 0)
    
    if (mov.tipo === 'ENTRADA') {
      entriesCount++
      entriesValue += value
    } else if (mov.tipo === 'SALIDA') {
      exitsCount++
      exitsValue += value
    }
  })

  return {
    entries: { count: entriesCount, value: entriesValue },
    exits: { count: exitsCount, value: exitsValue },
  }
})

const topProducts = computed(() => {
  const counts: Record<string, { movements: number, value: number }> = {}
  
  filteredMovements.value.forEach(mov => {
    const product = products.value.find(p => p.id === mov.id_producto)
    const value = mov.cantidad * (product?.precio || 0)
    if (!counts[mov.id_producto]) {
      counts[mov.id_producto] = { movements: 0, value: 0 }
    }
    counts[mov.id_producto].movements++
    counts[mov.id_producto].value += value
  })

  return Object.entries(counts)
    .map(([id, data]) => {
      const product = products.value.find(p => p.id === id)
      return {
        sku: product?.sku || 'N/A',
        name: product?.nombre || 'Desconocido',
        movements: data.movements,
        value: data.value
      }
    })
    .sort((a, b) => b.movements - a.movements)
    .map((p, index) => ({ ...p, rank: index + 1 }))
    .slice(0, 5)
})

const lowStockAlerts = computed(() => {
  return products.value
    .filter(p => p.stock <= (p.stockMinimo || globalDefaultMinStock.value))
    .map(p => ({
      name: p.nombre,
      categoria: categorias.value.find(c => c.id === p.categoriaId)?.nombre || '-',
      stock: p.stock,
      minStock: p.stockMinimo || globalDefaultMinStock.value,
      daysToZero: '-' 
    }))
})

const reportTypes = [
  { id: 'inventory', label: 'Inventario General (Valoración)', icon: 'i-lucide-package', description: 'Valor del inventario por categoría' },
  { id: 'movements', label: 'Historial de Movimientos', icon: 'i-lucide-arrow-left-right', description: 'Historial de entradas y salidas recientes' },
  { id: 'low-stock', label: 'Alerta Stock Bajo', icon: 'i-lucide-alert-triangle', description: 'Productos por debajo del mínimo' },
]

function applyAutoTable(doc: any, options: any) {
  if (typeof jspdfAutotable === 'function') {
    jspdfAutotable(doc, options)
  } else if (jspdfAutotable && typeof (jspdfAutotable as any).default === 'function') {
    (jspdfAutotable as any).default(doc, options)
  } else {
    doc.autoTable(options)
  }
}

function generateReport(reportId: string) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();
  
  doc.setFontSize(18);
  doc.text('Reporte de Inventario', 14, 22);
  doc.setFontSize(11);
  doc.text(`Fecha: ${dateStr}`, 14, 30);

  if (reportId === 'inventory') {
    doc.text(`Valor Total: €${inventoryValue.value.total.toFixed(2)}`, 14, 40);
    applyAutoTable(doc, {
      startY: 45,
      head: [['Categoría', 'Valor Total', 'Porcentaje']],
      body: inventoryValue.value.byCategory.map(c => [
        c.name, 
        `€${c.value.toFixed(2)}`, 
        `${c.percentage}%`
      ]),
    });
    doc.save(`Reporte_Inventario_${dateStr}.pdf`);
  } else if (reportId === 'low-stock') {
    doc.text('Productos con Stock Bajo:', 14, 40);
    applyAutoTable(doc, {
      startY: 45,
      head: [['Producto', 'Categoría', 'Stock', 'Stock Mínimo']],
      body: lowStockAlerts.value.map(p => [
        p.name, 
        p.categoria, 
        p.stock.toString(), 
        p.minStock.toString()
      ]),
    });
    doc.save(`Reporte_Stock_Bajo_${dateStr}.pdf`);
  } else if (reportId === 'movements') {
    doc.text(`Últimos Movimientos (${periodOptions.find(p => p.value === selectedPeriod.value)?.label}):`, 14, 40);
    applyAutoTable(doc, {
      startY: 45,
      head: [['Fecha', 'Tipo', 'Cantidad', 'Producto']],
      body: filteredMovements.value.map(m => {
        const prod = products.value.find(p => p.id === m.id_producto)
        return [
          new Date(m.fecha_movimiento).toLocaleDateString(),
          m.tipo,
          m.cantidad.toString(),
          prod ? prod.nombre : m.id_producto
        ]
      }),
    });
    doc.save(`Reporte_Movimientos_${dateStr}.pdf`);
  } else {
    alert('Este reporte está en construcción');
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Reportes">
        <template #right>
          <div class="hidden sm:flex gap-2">
            <USelectMenu
              v-model="selectedPeriod"
              :items="periodOptions"
              value-key="value"
              class="w-40 shrink-0"
            />
            <USelectMenu
              v-model="selectedWarehouse"
              :items="warehouseOptions"
              value-key="value"
              placeholder="Todos los almacenes"
              class="w-48 shrink-0"
            />
          </div>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="sm:hidden">
        <template #right>
          <div class="flex w-full overflow-x-auto gap-2 pb-1 sm:pb-0">
            <USelectMenu
              v-model="selectedPeriod"
              :items="periodOptions"
              value-key="value"
              class="w-36 sm:w-40 shrink-0"
            />
            <USelectMenu
              v-model="selectedWarehouse"
              :items="warehouseOptions"
              value-key="value"
              placeholder="Todos los almacenes"
              class="w-44 sm:w-48 shrink-0"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div v-if="isLoading" class="flex justify-center p-12">
        <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
      </div>
      <div v-else class="flex flex-col gap-6 p-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Valor del Inventario</p>
                <p class="mt-1 text-2xl font-semibold text-default">€{{ inventoryValue.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                <div class="mt-2 flex items-center gap-1 text-sm">
                  <UIcon name="i-lucide-trending-up" class="size-4 text-emerald-500" />
                  <span class="text-emerald-500">Actual</span>
                </div>
              </div>
              <div class="rounded-lg bg-emerald-500/10 p-3">
                <UIcon name="i-lucide-dollar-sign" class="size-6 text-emerald-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Entradas</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ movementStats.entries.count }}</p>
                <p class="mt-2 text-sm text-muted">€{{ movementStats.entries.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
              </div>
              <div class="rounded-lg bg-blue-500/10 p-3">
                <UIcon name="i-lucide-package-plus" class="size-6 text-blue-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Salidas</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ movementStats.exits.count }}</p>
                <p class="mt-2 text-sm text-muted">€{{ movementStats.exits.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
              </div>
              <div class="rounded-lg bg-amber-500/10 p-3">
                <UIcon name="i-lucide-package-minus" class="size-6 text-amber-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Alertas Stock</p>
                <p class="mt-1 text-2xl font-semibold text-red-500">{{ lowStockAlerts.length }}</p>
                <NuxtLink to="/stock" class="mt-2 flex w-max items-center text-sm text-red-500/80 hover:text-red-500 hover:underline transition-colors cursor-pointer">
                  Ver productos
                  <UIcon name="i-lucide-arrow-right" class="ml-1 size-3" />
                </NuxtLink>
              </div>
              <div class="rounded-lg bg-red-500/10 p-3">
                <UIcon name="i-lucide-alert-triangle" class="size-6 text-red-500" />
              </div>
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Inventory by Category -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-default">Valor por Categoría</h3>
            </template>
            <div class="space-y-4">
              <div v-for="category in inventoryValue.byCategory" :key="category.name" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-default">{{ category.name }}</span>
                  <span class="font-semibold text-default">€{{ category.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <UProgress :value="category.percentage" color="primary" size="sm" />
              </div>
              <div v-if="inventoryValue.byCategory.length === 0" class="text-sm text-muted py-2">
                No hay productos con valor.
              </div>
            </div>
          </UCard>

          <!-- Top Products -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-default">Productos con Mayor Movimiento</h3>
            </template>
            <div class="space-y-3">
              <div v-for="product in topProducts" :key="product.sku" class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div class="flex items-center gap-3">
                  <div class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {{ product.rank }}
                  </div>
                  <div>
                    <p class="font-medium text-default">{{ product.name }}</p>
                    <p class="text-xs text-muted">{{ product.sku }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-default">{{ product.movements }}</p>
                  <p class="text-xs text-muted">movimientos</p>
                </div>
              </div>
              <div v-if="topProducts.length === 0" class="text-sm text-muted py-2">
                No hay movimientos en este periodo.
              </div>
            </div>
          </UCard>
        </div>

        <!-- Low Stock Alerts -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-alert-triangle" class="size-5 text-amber-500" />
              <h3 class="text-lg font-semibold text-default">Alertas de Stock Bajo</h3>
            </div>
          </template>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="alert in lowStockAlerts" :key="alert.name" class="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-medium text-default">{{ alert.name }}</p>
                  <p class="text-sm text-muted">Stock: {{ alert.stock }} / {{ alert.minStock }}</p>
                </div>
                <UBadge color="error" label="Bajo" variant="subtle" />
              </div>
            </div>
            <div v-if="lowStockAlerts.length === 0" class="col-span-full text-sm text-muted py-2">
              No hay productos con stock crítico.
            </div>
          </div>
        </UCard>

        <!-- Generate Reports -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-default">Generar Reportes</h3>
          </template>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="report in reportTypes"
              :key="report.id"
              class="flex items-start gap-3 rounded-lg border border-default bg-elevated p-4 text-left transition-colors hover:bg-muted"
              @click="generateReport(report.id)"
            >
              <div class="rounded-lg bg-primary/10 p-2">
                <UIcon :name="report.icon" class="size-5 text-primary" />
              </div>
              <div>
                <p class="font-medium text-default">{{ report.label }}</p>
                <p class="text-sm text-muted">{{ report.description }}</p>
              </div>
            </button>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
