<template>
    <div class="p-8 font-sans">
        <h1 class="text-2xl font-bold mb-6">Panel de Gestión de Inventario</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section class="bg-gray-50 p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4 border-b pb-2">Categorías</h2>
                <div v-if="pendingCat">Cargando categorías...</div>
                <ul v-else class="space-y-2">
                    <li v-for="cat in categorias" :key="cat.id" class="p-2 bg-white rounded border">
                        {{ cat.nombre }}
                        <span class="text-xs text-gray-400 block">{{ cat.descripcion }}</span>
                    </li>
                </ul>
            </section>

            <section class="bg-gray-50 p-4 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4 border-b pb-2">Productos</h2>
                <div v-if="pendingProd">Cargando productos...</div>
                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left bg-white rounded">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="p-2">Nombre</th>
                                <th class="p-2">Precio</th>
                                <th class="p-2">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in productos" :key="prod.id" class="border-t">
                                <td class="p-2">{{ prod.nombre }}</td>
                                <td class="p-2">${{ prod.precio }}</td>
                                <td class="p-2">{{ prod.stock }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
const config = useRuntimeConfig()

// Consumo de Categorías (ms-inventario a través del Gateway)
const { data: categorias, pending: pendingCat } = await useFetch('/categorias', {
    baseURL: config.public.apiBase
})

// Consumo de Productos (ms-inventario a través del Gateway)
const { data: productos, pending: pendingProd } = await useFetch('/productos', {
    baseURL: config.public.apiBase
})
</script>