<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  precio: z.number().positive('Debe ser mayor a 0'),
  stock: z.number().int().min(0, 'No puede ser negativo'),
  categoriaId: z.string().uuid('UUID inválido')
})

const isOpen = ref(false) // Variable para el modal
const toast = useToast()

const state = reactive({
  nombre: undefined,
  precio: undefined,
  stock: undefined,
  categoriaId: undefined
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
  try {
    await $fetch('/api/inventario', { method: 'POST', body: event.data })
    toast.add({ title: 'Éxito', description: 'Producto creado', color: 'success' })
    isOpen.value = false
    refreshNuxtData()
  } catch (error) {
    toast.add({ title: 'Error', color: 'error' })
  }
}
</script>

<template>
  <div>
    <UButton label="Nuevo Producto" icon="i-lucide-plus" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-bold">Nuevo Producto</h3>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Nombre" name="nombre">
            <UInput v-model="state.nombre" />
          </UFormGroup>

          <UFormGroup label="Precio" name="precio">
            <UInput v-model.number="state.precio" type="number" step="0.01" />
          </UFormGroup>

          <UFormGroup label="Stock" name="stock">
            <UInput v-model.number="state.stock" type="number" />
          </UFormGroup>

          <UFormGroup label="Categoría ID" name="categoriaId">
            <UInput v-model="state.categoriaId" placeholder="UUID" />
          </UFormGroup>

          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" label="Cancelar" @click="isOpen = false" />
            <UButton type="submit" label="Guardar" />
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>
