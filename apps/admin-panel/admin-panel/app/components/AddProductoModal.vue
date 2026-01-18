<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Esquema de validación basado en tu CreateProductoDto
const schema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  categoriaId: z.string().uuid('Debes ingresar un ID de categoría válido (UUID)')
})

const open = ref(false)
const toast = useToast()

const state = reactive({
  nombre: undefined,
  precio: undefined,
  stock: undefined,
  categoriaId: undefined
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
  try {
    await $fetch('/api/inventario', {
      method: 'POST',
      body: event.data
    })

    toast.add({ title: 'Éxito', description: 'Producto creado correctamente', color: 'success' })
    open.value = false

    // Limpiamos el formulario
    Object.assign(state, { nombre: '', precio: 0, stock: 0, categoriaId: '' })

    // Refrescamos la tabla de la página principal
    refreshNuxtData('productos-list')
  } catch (error) {
    toast.add({ title: 'Error', description: 'Hubo un problema al guardar el producto', color: 'error' })
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Nuevo Producto" description="Agregue un nuevo item al inventario">
    <UButton label="Nuevo Producto" icon="i-lucide-plus" />

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nombre del Producto" name="nombre">
          <UInput v-model="state.nombre" placeholder="Ej: Laptop Dell" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Precio" name="precio">
            <UInput v-model.number="state.precio" type="number" step="0.01" icon="i-lucide-dollar-sign" />
          </UFormField>

          <UFormField label="Stock Inicial" name="stock">
            <UInput v-model.number="state.stock" type="number" icon="i-lucide-package" />
          </UFormField>
        </div>

        <UFormField label="ID de Categoría (UUID)" name="categoriaId">
          <UInput v-model="state.categoriaId" placeholder="UUID de la categoría" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton label="Cancelar" color="neutral" variant="subtle" @click="open = false" />
          <UButton label="Crear Producto" type="submit" color="primary" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
