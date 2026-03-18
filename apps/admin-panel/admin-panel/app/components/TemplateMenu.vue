<script setup lang="ts">
const items = [
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
</script>

<template>
  <UHorizontalNavigation :links="items" class="border-b border-gray-200 dark:border-gray-800" />
</template>
