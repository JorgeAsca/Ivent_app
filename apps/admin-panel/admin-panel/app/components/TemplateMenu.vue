<script setup lang="ts">
// Definición de los ítems del menú de navegación
const items = [
  [
    {
      label: 'Inicio',
      icon: 'i-lucide-house',
      to: '/'
    },
    {
      label: 'Productos',
      icon: 'i-lucide-package',
      to: '/productos'
    }
  ]
]
</script>

<template>
  <UNavigationMenu :items="items" class="w-full" />
</template>
