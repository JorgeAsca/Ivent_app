<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <AppLogo class="w-auto h-6" />
          <span class="font-bold text-xl">IventApp</span>
        </NuxtLink>
      </template>

      <template #right>
        <TemplateMenu />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} - Panel de Administración
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
