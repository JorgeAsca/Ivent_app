<template>
    <div>
        <div v-if="pendingCat || pendingProd" class="loading-overlay">Cargando resumen...</div>

        <div v-else>
            <div class="stats-grid">
                <StatCard title="Total Productos" :value="productos?.length || 0" />
                <StatCard title="Categorías" :value="categorias?.length || 0" />
            </div>

            <div class="tables-grid">
                <InventoryTable title="Resumen Categorías" :headers="['Nombre', 'Descripción']" hide-add>
                    <tr v-for="cat in categorias" :key="cat.id">
                        <td>{{ cat.nombre }}</td>
                        <td>{{ cat.descripcion || 'Sin descripción' }}</td>
                    </tr>
                </InventoryTable>

                <InventoryTable title="Resumen Productos" :headers="['Producto', 'Precio', 'Stock']" hide-add>
                    <tr v-for="prod in productos" :key="prod.id">
                        <td>{{ prod.nombre }}</td>
                        <td>${{ prod.precio }}</td>
                        <td>
                            <span :class="['badge', prod.stock < 5 ? 'low' : 'ok']">{{ prod.stock }}</span>
                        </td>
                    </tr>
                </InventoryTable>
            </div>
        </div>
    </div>
</template>

<script setup>
const { getCategorias, getProductos } = useInventario()
const { data: categorias, pending: pendingCat } = getCategorias()
const { data: productos, pending: pendingProd } = getProductos()
</script>