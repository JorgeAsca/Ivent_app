<script setup lang="ts">
import { useProducts, type Product } from '~/composables/useProducts'
import { useCategorias, type Categoria } from '~/composables/useCategorias'
import { useAlmacenes } from '~/composables/useAlmacenes'
import { useEmpresas } from '~/composables/useEmpresas'
import { usePermissions } from '~/composables/usePermissions'

definePageMeta({ layout: 'dashboard' })

const { hasPermission } = usePermissions()
const toast = useToast()
const isModalOpen = ref(false)
const isDetailsModalOpen = ref(false)
const selectedProductDetails = ref<any>(null)
const isEditMode = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string | undefined>(undefined)

const { getProducts, createProduct, updateProduct, deleteProduct: removeProduct } = useProducts()
const { getCategorias } = useCategorias()
const { getAlmacenes, getWarehouseStock } = useAlmacenes()
const { getEmpresas } = useEmpresas()

const products = ref<Product[]>([])
const categorias = ref<Categoria[]>([])
const almacenes = ref<any[]>([])
const stockMap = ref<Record<string, { nombre: string, cantidad: number }[]>>({})

onMounted(async () => {
  try {
    const [dataProducts, dataCategorias, empresas] = await Promise.all([
      getProducts(),
      getCategorias(),
      getEmpresas()
    ])
    if (dataProducts) products.value = dataProducts
    if (dataCategorias) categorias.value = dataCategorias
    
    if (empresas && empresas.length > 0) {
      const activeEmpresa = empresas[0].id_empresa
      const alms = await getAlmacenes(activeEmpresa)
      if (alms) {
        almacenes.value = alms
        
        // Fetch stock for each warehouse to map products to their warehouses
        for (const alm of alms) {
          try {
            const stock = await getWarehouseStock(alm.id)
            if (stock) {
              for (const s of stock) {
                if (s.cantidad !== 0) {
                  if (!stockMap.value[s.id_producto]) stockMap.value[s.id_producto] = []
                  const existing = stockMap.value[s.id_producto].find(x => x.nombre === alm.nombre)
                  if (existing) {
                    existing.cantidad += s.cantidad
                  } else {
                    stockMap.value[s.id_producto].push({ nombre: alm.nombre, cantidad: s.cantidad })
                  }
                }
              }
            }
          } catch (e) {
            console.error('Error fetching stock for warehouse', alm.id, e)
          }
        }
      }
    }
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }

  // Query params handling
  const route = useRoute()
  if (route.query.new === 'true') {
    openNewProductModal()
  }
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }
})

const currentProduct = ref<Partial<Product>>({
  sku: '',
  nombre: '',
  categoriaId: '',
  almacenId: '',
  stock: 0,
  precio: 0,
  costo: 0,
  activo: true,
  tipo: 'SIMPLE'
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const nameMatch = product.nombre ? product.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const skuMatch = product.sku ? product.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const matchesSearch = nameMatch || skuMatch
    const matchesCategory = !selectedCategory.value || product.categoria?.id === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const columns = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'categoria', header: 'Categoria' },
  { accessorKey: 'almacenes', header: 'Ubicaciones' },
  { accessorKey: 'stock', header: 'Stock Global' },
  { accessorKey: 'costo', header: 'Costo' },
  { accessorKey: 'precio', header: 'Precio' },
  { id: 'actions', header: '' },
]

const tipoOptions = [
  { value: 'SIMPLE', label: 'Simple (Insumo)' },
  { value: 'COMPUESTO', label: 'Compuesto (Fabricado)' }
]

const categoryOptions = computed(() => categorias.value.map(c => ({ value: c.id, label: c.nombre })))
const warehouseOptions = computed(() => almacenes.value.map(a => ({ value: a.id, label: a.nombre })))

const unidadOptions = [
  { value: 'Ud', label: 'Unidades (Ud)' },
  { value: 'Pq', label: 'Paquetes (Pq)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lb', label: 'Libras (lb)' },
  { value: 'L', label: 'Litros (L)' },
]

function openNewProductModal() {
  isEditMode.value = false
  currentProduct.value = {
    sku: '',
    nombre: '',
    categoriaId: '',
    almacenId: '',
    stock: 0,
    precio: 0,
    activo: true,
    unidadMedida: 'Ud',
    costo: 0,
    tipo: 'SIMPLE'
  }
  isModalOpen.value = true
}

function openEditModal(product: Product) {
  isEditMode.value = true
  currentProduct.value = { ...product, categoriaId: product.categoria?.id }
  isModalOpen.value = true
}

function viewDetails(product: any) {
  selectedProductDetails.value = product
  isDetailsModalOpen.value = true
}

async function saveProduct() {
  try {
    const payload = {
      sku: currentProduct.value.sku,
      nombre: currentProduct.value.nombre,
      categoriaId: currentProduct.value.categoriaId,
      almacenId: currentProduct.value.almacenId,
      unidadMedida: currentProduct.value.unidadMedida,
      stock: currentProduct.value.stock,
      precio: currentProduct.value.precio,
      costo: currentProduct.value.costo,
      tipo: currentProduct.value.tipo
    }

    if (isEditMode.value && currentProduct.value.id) {
      const updated = await updateProduct(currentProduct.value.id, payload)
      const index = products.value.findIndex(p => p.id === currentProduct.value.id)
      if (index !== -1 && updated) {
        products.value[index] = updated
      }
      toast.add({ title: 'Producto actualizado', icon: 'i-lucide-check', color: 'success' })
    } else {
      const created = await createProduct(payload)
      if (created) {
        products.value.push(created)
      }
      toast.add({ title: 'Producto creado', icon: 'i-lucide-check', color: 'success' })
    }
    isModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando producto:', error)
    toast.add({ title: 'Error al guardar el producto', description: error.message, color: 'error' })
  }
}

async function deleteProduct(id: string) {
  try {
    await removeProduct(id)
    products.value = products.value.filter(p => p.id !== id)
    toast.add({ title: 'Producto eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar el producto', color: 'error' })
  }
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Productos">
        <template #right>
          <div class="hidden sm:flex gap-2 items-center">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Buscar productos..."
              class="w-64"
            />
            <USelectMenu
              v-model="selectedCategory"
              :items="categorias"
              value-key="id"
              label-key="nombre"
              placeholder="Todas las categorias"
              class="w-48"
            />
            <UButton v-if="hasPermission('productos:crear')" icon="i-lucide-plus" label="Nuevo Producto" @click="openNewProductModal" />
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
              class="w-32 shrink-0"
            />
            <USelectMenu
              v-model="selectedCategory"
              :items="categorias"
              value-key="id"
              label-key="nombre"
              placeholder="Categorias"
              class="w-32 shrink-0"
            />
            <UButton v-if="hasPermission('productos:crear')" icon="i-lucide-plus" label="Nuevo" @click="openNewProductModal" class="shrink-0" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <UCard>
          <UTable :data="filteredProducts" :columns="columns">
            <template #sku-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.sku }}</span>
            </template>
            <template #nombre-cell="{ row }">
              <span class="font-medium text-default hover:underline cursor-pointer transition-colors" @click="viewDetails(row.original)">{{ row.original.nombre }}</span>
            </template>
            <template #tipo-cell="{ row }">
              <UBadge
                :color="row.original.tipo === 'COMPUESTO' ? 'primary' : 'neutral'"
                :label="row.original.tipo === 'COMPUESTO' ? 'Compuesto' : 'Simple'"
                variant="subtle"
              />
            </template>
            <template #categoria-cell="{ row }">
              <span class="text-default">{{ row.original.categoria?.nombre || '-' }}</span>
            </template>
            <template #almacenes-cell="{ row }">
              <span class="text-default" v-if="stockMap[row.original.id] && stockMap[row.original.id].length > 0">
                {{ stockMap[row.original.id].map(x => x.nombre).join(', ') }}
              </span>
              <span v-else class="text-muted text-sm">-</span>
            </template>
            <template #stock-cell="{ row }">
              <span class="text-default">{{ row.original.stock }} {{ row.original.unidadMedida || 'Ud' }}</span>
            </template>
            <template #costo-cell="{ row }">
              <span class="text-default">€{{ Number(row.original.costo || 0).toFixed(2) }}</span>
            </template>
            <template #precio-cell="{ row }">
              <span class="text-default">€{{ Number(row.original.precio).toFixed(2) }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Ver detalles', icon: 'i-lucide-eye', onSelect: () => viewDetails(row.original) },
                    ...(hasPermission('productos:editar') ? [{ label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(row.original) }] : []),
                  ],
                  ...(hasPermission('productos:eliminar') ? [[{ label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteProduct(row.original.id) }]] : []),
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

  <!-- Product Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Producto' : 'Nuevo Producto'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="SKU" name="sku">
            <UInput v-model="currentProduct.sku" placeholder="HAR-001" />
          </UFormField>
          <UFormField label="Nombre" name="nombre">
            <UInput v-model="currentProduct.nombre" placeholder="Nombre del producto" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <UFormField label="Categoria" name="categoria">
            <USelectMenu 
              v-model="currentProduct.categoriaId" 
              :items="categorias" 
              value-key="id"
              label-key="nombre"
              placeholder="Seleccionar" 
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4" v-if="!isEditMode">
          <UFormField label="Stock Inicial" name="stock">
            <UInput v-model.number="currentProduct.stock" type="number" />
          </UFormField>
          <UFormField label="Almacén Inicial" name="almacen">
            <USelectMenu 
              v-model="currentProduct.almacenId" 
              :items="warehouseOptions"
              value-key="value"
              placeholder="Seleccionar almacén" 
            />
          </UFormField>
        </div>

        <!-- Seccion de Desglose de Stock (Solo Edicion) -->
        <div v-if="isEditMode" class="mt-2 rounded-lg border border-white/10 bg-neutral-900/50 p-4">
          <p class="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <UIcon name="i-lucide-boxes" class="size-4" />
            Stock por Almacén
          </p>
          <div v-if="!stockMap[currentProduct.id!] || stockMap[currentProduct.id!].length === 0" class="text-sm text-zinc-500">
            Este producto no tiene stock en ningún almacén.
          </div>
          <ul v-else class="space-y-2">
            <li v-for="alm in stockMap[currentProduct.id!]" :key="alm.nombre" class="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <span class="text-zinc-300">{{ alm.nombre }}</span>
              <span class="font-medium text-white">{{ alm.cantidad }} {{ currentProduct.unidadMedida || 'Ud' }}</span>
            </li>
            <li class="flex justify-between items-center text-sm pt-2 font-bold border-t border-white/10 text-primary">
              <span>Total Global</span>
              <span>{{ currentProduct.stock }} {{ currentProduct.unidadMedida || 'Ud' }}</span>
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Costo de producto" name="costo">
            <div v-if="currentProduct.tipo === 'COMPUESTO'" class="text-sm text-zinc-500 mt-2">
              Se autocalcula según la receta
            </div>
            <UInput v-else v-model.number="currentProduct.costo" type="number" step="0.01" icon="i-lucide-euro" />
          </UFormField>
          <UFormField label="Precio de Venta" name="precio">
            <UInput v-model.number="currentProduct.precio" type="number" step="0.01" icon="i-lucide-euro" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Unidad de Medida" name="unidadMedida">
            <USelectMenu 
              v-model="currentProduct.unidadMedida" 
              :items="unidadOptions"
              value-key="value"
              label-key="label"
              placeholder="Ej: Ud, kg, L" 
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Producto'" @click="saveProduct" />
      </div>
    </template>
  </UModal>

  <!-- Details Modal -->
  <UModal v-model:open="isDetailsModalOpen" title="Detalles del Producto">
    <template #body>
      <div v-if="selectedProductDetails" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">SKU</p>
            <p class="font-mono text-sm text-default">{{ selectedProductDetails.sku }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Nombre</p>
            <p class="font-medium text-default">{{ selectedProductDetails.nombre }}</p>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">Categoría</p>
            <p class="text-default">{{ selectedProductDetails.categoria?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Tipo</p>
            <UBadge
              :color="selectedProductDetails.tipo === 'COMPUESTO' ? 'primary' : 'neutral'"
              :label="selectedProductDetails.tipo === 'COMPUESTO' ? 'Compuesto' : 'Simple'"
              variant="subtle"
              size="sm"
            />
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">Costo</p>
            <p class="text-default">€{{ Number(selectedProductDetails.costo || 0).toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Precio de Venta</p>
            <p class="text-default">€{{ Number(selectedProductDetails.precio || 0).toFixed(2) }}</p>
          </div>
        </div>

        <USeparator />
        
        <!-- Stock Breakdown -->
        <div>
          <p class="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <UIcon name="i-lucide-boxes" class="size-4" />
            Stock por Almacén
          </p>
          <div v-if="!stockMap[selectedProductDetails.id!] || stockMap[selectedProductDetails.id!].length === 0" class="text-sm text-zinc-500">
            Este producto no tiene stock en ningún almacén.
          </div>
          <ul v-else class="space-y-2">
            <li v-for="alm in stockMap[selectedProductDetails.id!]" :key="alm.nombre" class="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <span class="text-zinc-300">{{ alm.nombre }}</span>
              <span class="font-medium text-white">{{ alm.cantidad }} {{ selectedProductDetails.unidadMedida || 'Ud' }}</span>
            </li>
            <li class="flex justify-between items-center text-sm pt-2 font-bold border-t border-white/10 text-primary">
              <span>Total Global</span>
              <span>{{ selectedProductDetails.stock }} {{ selectedProductDetails.unidadMedida || 'Ud' }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton label="Cerrar" color="neutral" variant="ghost" @click="isDetailsModalOpen = false" />
      </div>
    </template>
  </UModal>
</template>
