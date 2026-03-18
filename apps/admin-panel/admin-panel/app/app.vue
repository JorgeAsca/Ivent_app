<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black">
    <header class="admin-header">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <AppLogo class="w-8 h-8" />
          <span class="logo-text">IventApp</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <TemplateMenu />
          <UColorModeButton />
        </div>
      </div>
    </header>

    <main class="admin-main-content">
      <UContainer class="py-6">
        <NuxtPage />
      </UContainer>
    </main>
    <UNotifications />
  </div>
</template>
