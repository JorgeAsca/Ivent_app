<template>
  <UApp>
    <UHeader class="admin-header">
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <AppLogo class="w-auto h-8"></AppLogo>
          <span class="logo-text">IventApp</span>
        </NuxtLink>
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <TemplateMenu />
          <div class="divider-vertical"></div>
          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <UMain class="admin-main-content">
      <NuxtPage />
    </UMain>

    <UFooter class="admin-footer">
      <template #left>
        <p class="footer-copy">
          © {{ new Date().getFullYear() }} - IventApp Business Intelligence
        </p>
      </template>
      <template #right>
        <UButton
          to="https://github.com/jorgeasca/ivent_app"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>

    <UNotifications />
  </UApp>
</template>
