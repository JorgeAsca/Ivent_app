<template>
    <div>
        <div class="header-actions">
            <h2>Reportes y Estadísticas</h2>
            <button class="btn-primary" @click="refreshAll" :disabled="pending">
                🔄 Actualizar Datos
            </button>
        </div>

        <div v-if="pending" class="loading-overlay">Calculando métricas...</div>

        <div v-else>
            <div class="stats-grid" style="margin-top: 20px;">
                <StatCard title="Capital Invertido (Valor Total)" :value="formatoMoneda(valorTotalInventario)" />
                <StatCard title="Productos en Riesgo (Stock <= 5)" :value="productosEnRiesgo.length.toString()" />
            </div>

            <div class="tables-grid" style="margin-top: 20px; align-items: start;">

                <div
                    style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h3 style="margin-bottom: 20px;">Distribución por Categorías</h3>
                    <div
                        style="height: 300px; display: flex; justify-content: center; align-items: center; width: 100%;">
                        <ClientOnly>
                            <Doughnut v-if="hasChartData" :data="chartData" :options="chartOptions" />
                            <p v-else style="color: #999; text-align: center;">
                                Agrega al menos un producto a una categoría para generar el gráfico 📊
                            </p>
                            <template #fallback>
                                <p style="color: #ccc;">Cargando gráfico...</p>
                            </template>
                        </ClientOnly>
                    </div>
                </div>

                <div
                    style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h3 style="margin-bottom: 20px; color: #e74c3c;">⚠️ Alerta de Stock Crítico</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Stock Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in productosEnRiesgo" :key="prod.id">
                                <td>{{ prod.nombre }}</td>
                                <td><small style="color: #666;">{{ prod.sku }}</small></td>
                                <td>
                                    <span class="badge low">{{ prod.stock }}</span>
                                </td>
                            </tr>
                            <tr v-if="productosEnRiesgo.length === 0">
                                <td colspan="3" class="empty" style="text-align: center; color: #27ae60;">
                                    ¡Todo en orden! Ningún producto tiene stock crítico.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

// Registrar elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

const { getCategorias, getProductos } = useInventario()
const { data: categorias, pending: pendingCat, refresh: refreshCat } = getCategorias()
const { data: productos, pending: pendingProd, refresh: refreshProd } = getProductos()

const pending = computed(() => pendingCat.value || pendingProd.value)

const refreshAll = async () => {
    await Promise.all([refreshCat(), refreshProd()])
}

// Utilidad para formatear dinero de forma segura
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor || 0)
}

// MÉTRICA 1: Valor Total Seguro (Forzando números)
const valorTotalInventario = computed(() => {
    if (!productos.value) return 0
    return productos.value.reduce((total, producto) => {
        return total + (Number(producto.precio) * Number(producto.stock))
    }, 0)
})

// MÉTRICA 2: Riesgo Seguro (Forzando números)
const productosEnRiesgo = computed(() => {
    if (!productos.value) return []
    return productos.value
        .filter(p => Number(p.stock) <= 5)
        .sort((a, b) => Number(a.stock) - Number(b.stock))
})

// MÉTRICA 3: Datos para el Gráfico Circular Blindados
const chartData = computed(() => {
    const defaultData = { labels: [], datasets: [{ data: [], backgroundColor: [] }] }
    if (!productos.value || !categorias.value) return defaultData

    const conteoPorCategoria = {}

    // 1. Inicializamos categorías reales
    categorias.value.forEach(cat => {
        conteoPorCategoria[cat.id] = { nombre: cat.nombre, cantidad: 0 }
    })

    // 2. Creamos un salvavidas por si un producto no tiene categoría válida
    conteoPorCategoria['sin_categoria'] = { nombre: 'Sin Categoría', cantidad: 0 }

    // 3. Contamos los productos
    productos.value.forEach(prod => {
    // LLAVE MAESTRA: Intenta ambas variantes y limpia espacios
    const rawId = prod.categoria_id || prod.categoriaId;
    const cId = rawId ? String(rawId).trim() : null;
    
    if (cId && conteoPorCategoria[cId]) {
      conteoPorCategoria[cId].cantidad += 1
    } else {
      conteoPorCategoria['sin_categoria'].cantidad += 1
    }
  })

    // 4. Solo mostramos los que tienen más de 0
    const categoriasActivas = Object.values(conteoPorCategoria).filter(cat => cat.cantidad > 0)

    if (categoriasActivas.length === 0) return defaultData

    return {
        labels: categoriasActivas.map(cat => cat.nombre),
        datasets: [
            {
                backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#F39C12', '#9B59B6', '#34495E', '#95A5A6'],
                data: categoriasActivas.map(cat => cat.cantidad),
                hoverOffset: 4
            }
        ]
    }
})

// Lógica segura para renderizar el gráfico
const hasChartData = computed(() => {
    return chartData.value.datasets[0].data.length > 0 && chartData.value.datasets[0].data.some(val => val > 0)
})

// Opciones visuales
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}
</script>