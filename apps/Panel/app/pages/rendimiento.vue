<script setup lang="ts">
import { useRecetas, type RecetaIngrediente, type CalculoRendimiento } from '~/composables/useRecetas'
import { useProducts, type Product } from '~/composables/useProducts'
import { useCategorias, type Categoria } from '~/composables/useCategorias'
import { useAlmacenes } from '~/composables/useAlmacenes'
import { useEmpresas } from '~/composables/useEmpresas'
import { usePermissions } from '~/composables/usePermissions'

definePageMeta({ layout: 'dashboard' })

const { hasPermission } = usePermissions()

const toast = useToast()
const { obtenerReceta, guardarReceta, calcularRendimiento, fabricarProducto } = useRecetas()
const { getProducts, createProduct, updateProduct, deleteProduct: removeProduct } = useProducts()
const { getCategorias } = useCategorias()
const { getAlmacenes } = useAlmacenes()
const { getEmpresas } = useEmpresas()

const products = ref<Product[]>([])
const categorias = ref<Categoria[]>([])
const almacenes = ref<any[]>([])
const route = useRoute()
const router = useRouter()
const selectedProductId = ref<string | null>((route.query.id as string) || null)
const selectedProduct = computed(() => products.value.find(p => p.id === selectedProductId.value))

const currentReceta = ref<RecetaIngrediente[]>([])
const currentRendimiento = ref<CalculoRendimiento | null>(null)

// Edit mode
const isEditing = ref(false)
const editableIngredientes = ref<{ ingrediente_id: string, cantidad_necesaria: number, id_almacen?: string }[]>([])

// For adding new ingredient to recipe
const newIngredientId = ref<string | null>(null)
const newIngredientQty = ref(1)
const newIngredientAlmacenId = ref<string | null>(null)

// Fabricar
const isFabricarModalOpen = ref(false)
const fabricarQty = ref(1)
const fabricarAlmacenId = ref<string | null>(null)

const filteredProductsForIngredients = computed(() => {
  return products.value.filter(p => p.id !== selectedProductId.value)
})

const fetchAll = async () => {
  try {
    const [prods, dataCategorias, empresas] = await Promise.all([
      getProducts(),
      getCategorias(),
      getEmpresas()
    ])
    products.value = prods || []
    if (dataCategorias) categorias.value = dataCategorias
    
    if (empresas && empresas.length > 0) {
      const activeEmpresa = empresas[0].id_empresa
      const alms = await getAlmacenes(activeEmpresa)
      if (alms) almacenes.value = alms
    }
    
    if (selectedProductId.value) {
      loadProductData()
    }
  } catch (e) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
}

onMounted(() => {
  fetchAll()
})

const loadProductData = async () => {
  if (!selectedProductId.value) return
  isEditing.value = false
  currentRendimiento.value = null
  
  try {
    const [recetaData, rendData] = await Promise.all([
      obtenerReceta(selectedProductId.value),
      calcularRendimiento(selectedProductId.value)
    ])
    
    currentReceta.value = recetaData || []
    currentRendimiento.value = rendData || null
  } catch (e) {
    toast.add({ title: 'Error cargando datos de rendimiento', color: 'error' })
  }
}

watch(selectedProductId, (newVal) => {
  if (newVal) {
    router.replace({ query: { ...route.query, id: newVal } })
  } else {
    const { id, ...rest } = route.query
    router.replace({ query: rest })
  }
  loadProductData()
})

const startEditing = () => {
  editableIngredientes.value = currentReceta.value.map(r => ({
    ingrediente_id: r.ingrediente_id,
    cantidad_necesaria: r.cantidad_necesaria,
    id_almacen: r.id_almacen
  }))
  newIngredientId.value = null
  newIngredientQty.value = 1
  newIngredientAlmacenId.value = null
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const addIngredientToRecipe = () => {
  if (!newIngredientId.value || newIngredientQty.value <= 0) return
  
  const exists = editableIngredientes.value.find(i => i.ingrediente_id === newIngredientId.value)
  if (exists) {
    exists.cantidad_necesaria = newIngredientQty.value
    if (newIngredientAlmacenId.value) exists.id_almacen = newIngredientAlmacenId.value
  } else {
    editableIngredientes.value.push({
      ingrediente_id: newIngredientId.value,
      cantidad_necesaria: newIngredientQty.value,
      id_almacen: newIngredientAlmacenId.value || undefined
    })
  }
  
  newIngredientId.value = null
  newIngredientQty.value = 1
  newIngredientAlmacenId.value = null
}

const removeIngredient = (id: string) => {
  editableIngredientes.value = editableIngredientes.value.filter(i => i.ingrediente_id !== id)
}

const getProductName = (id: string) => {
  const p = products.value.find(prod => prod.id === id)
  return p ? p.nombre : 'Desconocido'
}
const getProductUnit = (id: string) => {
  const p = products.value.find(prod => prod.id === id)
  return p ? p.unidadMedida : 'Ud'
}
const getAlmacenName = (id: string) => {
  const a = almacenes.value.find(alm => alm.id === id)
  return a ? a.nombre : 'Cualquier almacén'
}

const saveRecipe = async () => {
  if (!selectedProductId.value) return
  
  try {
    await guardarReceta(selectedProductId.value, editableIngredientes.value)
    toast.add({ title: 'Receta guardada exitosamente', color: 'success', icon: 'i-lucide-check' })
    await loadProductData()
    isEditing.value = false
  } catch (e: any) {
    toast.add({ title: 'Error al guardar la receta', description: e.message, color: 'error' })
  }
}

const openFabricar = () => {
  fabricarQty.value = 1
  fabricarAlmacenId.value = almacenes.value.length > 0 ? almacenes.value[0].id : null
  isFabricarModalOpen.value = true
}

const confirmFabricar = async () => {
  if (!selectedProductId.value || !fabricarAlmacenId.value) return
  try {
    const res = await fabricarProducto(selectedProductId.value, fabricarQty.value, fabricarAlmacenId.value)
    if (res.success) {
      toast.add({ title: 'Producto fabricado exitosamente', color: 'success', icon: 'i-lucide-check' })
      isFabricarModalOpen.value = false
      await loadProductData()
      // Note: In reality, we rely on NATS to update stock. A small delay might be needed, or real-time ws.
      setTimeout(fetchAll, 500)
    }
  } catch (e: any) {
    toast.add({ title: 'Error al fabricar', description: e.message, color: 'error' })
  }
}

const compositeProducts = computed(() => {
  return products.value.filter(p => p.tipo === 'COMPUESTO')
})

const ingredientOptions = computed(() => {
  return filteredProductsForIngredients.value
    .map(p => ({ value: p.id, label: `${p.nombre} (${p.unidadMedida || 'Ud'})` }))
})

// --- Modal for creating/editing Composite Product ---
const isModalOpen = ref(false)
const isProductEditMode = ref(false)
const currentProduct = ref<Partial<Product>>({
  sku: '',
  nombre: '',
  categoriaId: '',
  almacenId: '',
  stock: 0,
  precio: 0,
  costo: 0,
  activo: true,
  unidadMedida: 'Ud',
  tipo: 'COMPUESTO'
})

const warehouseOptions = computed(() => almacenes.value.map(a => ({ value: a.id, label: a.nombre })))
const unidadOptions = [
  { value: 'Ud', label: 'Unidades (Ud)' },
  { value: 'Pq', label: 'Paquetes (Pq)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lb', label: 'Libras (lb)' },
  { value: 'L', label: 'Litros (L)' },
]

function openNewProductModal() {
  isProductEditMode.value = false
  currentProduct.value = {
    sku: '',
    nombre: '',
    categoriaId: '',
    almacenId: '',
    stock: 0,
    precio: 0,
    costo: 0,
    activo: true,
    unidadMedida: 'Ud',
    tipo: 'COMPUESTO'
  }
  isModalOpen.value = true
}

function openEditProductModal(product: Product) {
  isProductEditMode.value = true
  currentProduct.value = { ...product, categoriaId: product.categoria?.id }
  isModalOpen.value = true
}

async function saveCompositeProduct() {
  try {
    const payload = {
      sku: currentProduct.value.sku,
      nombre: currentProduct.value.nombre,
      categoriaId: currentProduct.value.categoriaId,
      almacenId: currentProduct.value.almacenId,
      unidadMedida: currentProduct.value.unidadMedida,
      stock: currentProduct.value.stock,
      precio: currentProduct.value.precio,
      costo: 0,
      tipo: 'COMPUESTO' as const
    }
    
    if (isProductEditMode.value && currentProduct.value.id) {
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
        selectedProductId.value = created.id
        toast.add({ title: 'Producto compuesto creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isModalOpen.value = false
  } catch (error: any) {
    toast.add({ title: 'Error guardando producto', description: error.message, color: 'error' })
  }
}

async function deleteCompositeProduct(id: string) {
  try {
    await removeProduct(id)
    products.value = products.value.filter(p => p.id !== id)
    if (selectedProductId.value === id) {
      selectedProductId.value = null
    }
    toast.add({ title: 'Producto eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar el producto', color: 'error' })
  }
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Control de Rendimiento / Recetas">
        <template #right>
          <div class="hidden sm:flex gap-2">
              <UButton v-if="selectedProductId" icon="i-lucide-arrow-left" label="Volver a la lista" variant="ghost" @click="selectedProductId = null" />
              <UButton v-if="hasPermission('productos:crear')" icon="i-lucide-plus" label="Nuevo Producto Compuesto" @click="openNewProductModal" />
          </div>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="sm:hidden">
        <template #right>
          <div class="flex w-full overflow-x-auto gap-2 pb-1">
              <UButton v-if="selectedProductId" icon="i-lucide-arrow-left" label="Volver" variant="ghost" @click="selectedProductId = null" class="shrink-0" />
              <UButton v-if="hasPermission('productos:crear')" icon="i-lucide-plus" label="Nuevo Compuesto" @click="openNewProductModal" class="shrink-0" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <div v-if="!selectedProductId">
          <div v-if="compositeProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="rounded-full bg-neutral-800/50 p-6 mb-4">
              <UIcon name="i-lucide-chef-hat" class="size-12 text-zinc-500" />
            </div>
            <h2 class="text-xl font-semibold text-white">No hay productos compuestos</h2>
            <p class="mt-2 max-w-md text-zinc-400">
              Crea un nuevo producto compuesto para configurar su receta y calcular el rendimiento.
            </p>
          </div>
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <UCard v-for="prod in compositeProducts" :key="prod.id" class="cursor-pointer hover:border-primary/50 transition-colors" @click="selectedProductId = prod.id">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <UIcon name="i-lucide-package-open" class="size-8 text-primary" />
                  <div class="flex items-center gap-2">
                    <UDropdownMenu
                      :items="[
                        ...(hasPermission('productos:editar') ? [[{ label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditProductModal(prod) }]] : []),
                        ...(hasPermission('productos:eliminar') ? [[{ label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteCompositeProduct(prod.id) }]] : []),
                      ]"
                    >
                      <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" @click.stop />
                    </UDropdownMenu>
                  </div>
                </div>
                <h3 class="text-lg font-semibold text-white mt-2">{{ prod.nombre }}</h3>
                <p class="text-sm text-zinc-400">SKU: {{ prod.sku }}</p>
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span class="text-zinc-500">Stock: <strong class="text-white">{{ prod.stock }} {{ prod.unidadMedida || 'Ud' }}</strong></span>
                  <span class="text-zinc-500">Precio: <strong class="text-white">€{{ Number(prod.precio || 0).toFixed(2) }}</strong></span>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          <!-- SECCIÓN DE RECETA -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-white">Receta de {{ selectedProduct?.nombre }}</h3>
                  <p class="text-sm text-zinc-400">Fórmula requerida para fabricar 1 {{ selectedProduct?.unidadMedida }}</p>
                </div>
                <div class="flex gap-2">
                  <UButton
                    v-if="!isEditing && hasPermission('productos:editar')"
                    icon="i-lucide-settings"
                    color="neutral"
                    variant="soft"
                    title="Editar Detalles del Producto"
                    @click="openEditProductModal(selectedProduct!)"
                  />
                  <UButton
                    v-if="!isEditing && hasPermission('productos:editar')"
                    icon="i-lucide-pencil"
                    color="primary"
                    variant="soft"
                    label="Editar Receta"
                    @click="startEditing"
                  />
                </div>
              </div>
            </template>

            <!-- Modo Vista -->
            <div v-if="!isEditing">
              <div v-if="currentReceta.length === 0" class="py-8 text-center text-zinc-500">
                Este producto aún no tiene una receta configurada.
              </div>
              <ul v-else class="divide-y divide-white/10">
                <li v-for="item in currentReceta" :key="item.id" class="flex items-center justify-between py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex size-8 items-center justify-center rounded-lg bg-neutral-800">
                      <UIcon name="i-lucide-package" class="size-4 text-zinc-400" />
                    </div>
                    <div>
                      <p class="font-medium text-white">{{ item.ingrediente?.nombre || 'Desconocido' }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col text-right">
                    <p class="text-sm font-semibold text-white">{{ item.cantidad_necesaria }} {{ item.ingrediente?.unidadMedida }}</p>
                    <p class="text-xs text-zinc-500">{{ item.id_almacen ? getAlmacenName(item.id_almacen) : 'Cualquier almacén' }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Modo Edición -->
            <div v-else class="flex flex-col gap-4">
               <ul class="divide-y divide-white/10">
                <li v-for="item in editableIngredientes" :key="item.ingrediente_id" class="flex items-center justify-between py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex size-8 items-center justify-center rounded-lg bg-neutral-800">
                      <UIcon name="i-lucide-package" class="size-4 text-zinc-400" />
                    </div>
                    <p class="font-medium text-white">{{ getProductName(item.ingrediente_id) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <USelectMenu v-model="item.id_almacen" :items="warehouseOptions" value-key="value" label-key="label" placeholder="Almacén" class="w-40" />
                    <UInput v-model.number="item.cantidad_necesaria" type="number" step="0.01" class="w-24" />
                    <span class="text-sm text-zinc-400">{{ getProductUnit(item.ingrediente_id) }}</span>
                    <UButton icon="i-lucide-trash" color="error" variant="ghost" size="sm" @click="removeIngredient(item.ingrediente_id)" />
                  </div>
                </li>
              </ul>

              <div class="mt-4 flex items-end gap-2 rounded-lg border border-white/10 bg-neutral-900/50 p-4">
                <UFormField label="Ingrediente" class="flex-1">
                  <USelectMenu
                    v-model="newIngredientId"
                    :items="ingredientOptions"
                    value-key="value"
                    label-key="label"
                    searchable
                    placeholder="Buscar..."
                  />
                </UFormField>
                <UFormField label="Almacén" class="w-40">
                  <USelectMenu
                    v-model="newIngredientAlmacenId"
                    :items="warehouseOptions"
                    value-key="value"
                    label-key="label"
                    placeholder="Almacén"
                  />
                </UFormField>
                <UFormField label="Cant." class="w-24">
                  <UInput v-model.number="newIngredientQty" type="number" step="0.01" min="0.01" />
                </UFormField>
                <UButton icon="i-lucide-plus" color="primary" @click="addIngredientToRecipe" />
              </div>

              <div class="mt-4 flex justify-end gap-2">
                <UButton label="Cancelar" variant="ghost" color="neutral" @click="cancelEditing" />
                <UButton label="Guardar Cambios" color="success" icon="i-lucide-save" @click="saveRecipe" />
              </div>
            </div>
          </UCard>

          <!-- SECCIÓN DE RENDIMIENTO -->
          <UCard v-if="!isEditing && currentReceta.length > 0">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <UIcon name="i-lucide-calculator" class="size-5" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Calculadora de Producción</h3>
                    <p class="text-sm text-zinc-400">Rendimiento basado en el stock actual</p>
                  </div>
                </div>
                <UButton
                  v-if="hasPermission('movimientos:crear')"
                  icon="i-lucide-hammer"
                  color="primary"
                  label="Fabricar"
                  :disabled="currentRendimiento?.maxProduccion === 0"
                  @click="openFabricar"
                />
              </div>
            </template>

            <div v-if="currentRendimiento" class="flex flex-col gap-6">
              
              <!-- Resultado Principal -->
              <div class="rounded-xl border border-white/5 bg-neutral-900 p-6 text-center shadow-inner">
                <p class="mb-1 text-sm text-zinc-400">Puedes fabricar un máximo de</p>
                <div class="flex items-center justify-center gap-3">
                  <span class="text-5xl font-bold text-primary">{{ currentRendimiento.maxProduccion }}</span>
                  <span class="text-xl font-medium text-white">{{ selectedProduct?.unidadMedida }}(s)</span>
                </div>
                <p class="mt-2 text-xs text-zinc-500">Limitado por la cantidad de ingredientes disponibles</p>
              </div>

              <!-- Detalle de ingredientes -->
              <div>
                <h4 class="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Detalle del Consumo</h4>
                <div class="overflow-x-auto rounded-lg border border-white/10">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-neutral-800/50 text-zinc-400">
                      <tr>
                        <th class="px-4 py-3 font-medium">Ingrediente</th>
                        <th class="px-4 py-3 font-medium text-right">Stock Actual</th>
                        <th class="px-4 py-3 font-medium text-right">Req. Total</th>
                        <th class="px-4 py-3 font-medium text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5 bg-neutral-900/30">
                      <tr v-for="det in currentRendimiento.detalles" :key="det.ingrediente_id" :class="{'bg-red-500/5': det.limitante}">
                        <td class="px-4 py-3 font-medium text-white">
                           {{ det.nombre }}
                           <UIcon v-if="det.limitante" name="i-lucide-alert-circle" class="ml-1 inline size-4 text-red-500" title="Cuello de botella" />
                        </td>
                        <td class="px-4 py-3 text-right text-zinc-300">
                          {{ det.stock_actual }} <span class="text-xs text-zinc-500">{{ det.unidadMedida }}</span>
                        </td>
                        <td class="px-4 py-3 text-right text-zinc-300">
                          {{ (det.requerido_por_unidad * currentRendimiento.maxProduccion).toFixed(2) }} <span class="text-xs text-zinc-500">{{ det.unidadMedida }}</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <UBadge v-if="det.limitante" color="error" variant="subtle" size="sm">Limitante</UBadge>
                          <UBadge v-else color="success" variant="subtle" size="sm">Suficiente (+{{ det.sobrante }} {{ det.unidadMedida }})</UBadge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            
            <div v-else class="flex justify-center p-8">
               <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
            </div>

          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Modal Nuevo/Editar Producto Compuesto -->
  <UModal v-model:open="isModalOpen" :title="isProductEditMode ? 'Editar Producto Compuesto' : 'Nuevo Producto Compuesto'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="SKU" name="sku">
            <UInput v-model="currentProduct.sku" placeholder="PIZ-001" />
          </UFormField>
          <UFormField label="Nombre" name="nombre">
            <UInput v-model="currentProduct.nombre" placeholder="Ej: Pizza Margarita" />
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

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Stock Inicial" name="stock">
            <UInput v-model.number="currentProduct.stock" type="number" :disabled="isProductEditMode" />
          </UFormField>
          <UFormField label="Almacén Inicial" name="almacen" v-if="!isProductEditMode">
            <USelectMenu 
              v-model="currentProduct.almacenId" 
              :items="warehouseOptions"
              value-key="value"
              placeholder="Seleccionar almacén" 
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Precio de Venta" name="precio">
            <UInput v-model.number="currentProduct.precio" type="number" step="0.01" icon="i-lucide-euro" />
          </UFormField>
          <UFormField label="Unidad de Medida" name="unidadMedida">
            <USelectMenu 
              v-model="currentProduct.unidadMedida" 
              :items="unidadOptions"
              value-key="value"
              label-key="label"
              placeholder="Ej: Ud" 
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isProductEditMode ? 'Guardar Cambios' : 'Crear Producto'" @click="saveCompositeProduct" />
      </div>
    </template>
  </UModal>

  <!-- Modal Fabricar -->
  <UModal v-model:open="isFabricarModalOpen" title="Fabricar Producto">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="rounded-lg bg-primary/10 p-4 mb-2">
          <p class="text-primary font-medium">Puedes fabricar un máximo de {{ currentRendimiento?.maxProduccion }} unidades.</p>
        </div>
        
        <UFormField label="Cantidad a fabricar" name="cantidad">
          <UInput v-model.number="fabricarQty" type="number" :max="currentRendimiento?.maxProduccion" min="1" />
        </UFormField>
        
        <UFormField label="Almacén de destino" name="almacen_destino">
          <USelectMenu
            v-model="fabricarAlmacenId"
            :items="warehouseOptions"
            value-key="value"
            placeholder="Seleccionar almacén"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isFabricarModalOpen = false" />
        <UButton color="primary" label="Confirmar Producción" @click="confirmFabricar" />
      </div>
    </template>
  </UModal>
</template>
