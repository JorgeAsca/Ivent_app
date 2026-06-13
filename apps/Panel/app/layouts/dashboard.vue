<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const mainNavItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
  },
  {
    label: 'Productos',
    icon: 'i-lucide-package',
    to: '/productos',
  },
  {
    label: 'Categorias',
    icon: 'i-lucide-tags',
    to: '/categorias',
  },
  {
    label: 'Movimientos',
    icon: 'i-lucide-arrow-left-right',
    to: '/movimientos',
  },
  {
    label: 'Rendimiento / BOM',
    icon: 'i-lucide-chef-hat',
    to: '/rendimiento',
  },
  {
    label: 'Proveedores',
    icon: 'i-lucide-truck',
    to: '/proveedores',
  },
  {
    label: 'Almacenes',
    icon: 'i-lucide-warehouse',
    to: '/almacenes',
  },
  {
    label: 'Stock / Alertas',
    icon: 'i-lucide-bell',
    to: '/stock',
  },
])

const settingsNavItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Reportes',
    icon: 'i-lucide-bar-chart-3',
    to: '/reportes',
  },
  {
    label: 'Configuracion',
    icon: 'i-lucide-settings',
    children: [
      { label: 'General', icon: 'i-lucide-settings', to: '/configuracion?section=general' },
      { label: 'Inventario', icon: 'i-lucide-package', to: '/configuracion?section=inventory' },
      { label: 'Notificaciones', icon: 'i-lucide-bell', to: '/configuracion?section=notifications' },
      { label: 'Integraciones', icon: 'i-lucide-plug', to: '/configuracion?section=integrations' },
    ]
  },
])

const colorMode = useColorMode()
function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const router = useRouter()
const authToken = useCookie('auth_token')
const userCookie = useCookie('user_data')

function handleLogout() {
  console.log('Logging out...')
  authToken.value = null
  userCookie.value = null
  router.push('/login')
}

const dropdownItems = computed(() => [
  [
    { label: 'Mi perfil', icon: 'i-lucide-user', to: '/perfil', class: 'text-white' },
    { label: 'Usuarios', icon: 'i-lucide-users', to: '/preferencias', class: 'text-white' },
  ],
  [
    { label: 'Cerrar sesion', icon: 'i-lucide-log-out', color: 'error' as const, click: handleLogout, onSelect: handleLogout },
  ],
])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-neutral-950 text-white dark border-r border-white/10"
      :ui="{ content: 'w-[66vw] max-w-[66vw] sm:w-[66vw] sm:max-w-[66vw] bg-neutral-950 text-white dark border-r border-white/10' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 p-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UIcon name="i-lucide-box" class="size-5" />
          </div>
          <span v-if="!collapsed" class="font-semibold text-white">Inventapp</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-4 p-2">
          <UNavigationMenu
            :items="mainNavItems"
            orientation="vertical"
            :ui="{ 
              link: [collapsed ? 'justify-center' : undefined, 'text-zinc-400 hover:text-white hover:bg-white/5'],
              linkActive: 'text-white bg-white/10'
            }"
          />

          <USeparator class="border-white/10" />

          <UNavigationMenu
            :items="settingsNavItems"
            orientation="vertical"
            :ui="{ 
              link: [collapsed ? 'justify-center' : undefined, 'text-zinc-400 hover:text-white hover:bg-white/5'],
              linkActive: 'text-white bg-white/10',
              childList: 'bg-transparent border-l border-white/10 ml-4',
              childLink: 'text-zinc-400 hover:text-white hover:bg-white/5',
              childLinkActive: 'text-white bg-white/10'
            }"
          />

          <ClientOnly>
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              variant="ghost"
              :label="collapsed ? undefined : (colorMode.value === 'dark' ? 'Modo claro' : 'Modo oscuro')"
              :class="[
                collapsed ? 'justify-center w-full' : 'justify-start w-full',
                'text-zinc-400 hover:text-white hover:bg-white/5'
              ]"
              @click="toggleTheme"
            />
            <template #fallback>
              <div class="h-8 w-full" />
            </template>
          </ClientOnly>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <div class="border-t border-white/10 p-2">
          <UDropdownMenu
            :items="dropdownItems"
            :ui="{ content: 'bg-neutral-900 border-white/10 text-white dark' }"
          >
            <UButton
              variant="ghost"
              block
              :class="[
                collapsed ? 'justify-center' : 'justify-start',
                'text-zinc-400 hover:text-white hover:bg-white/5'
              ]"
            >
              <UAvatar
                :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${userCookie?.nombre || 'admin'}`"
                :alt="userCookie?.nombre || 'Usuario'"
                size="xs"
              />
              <span v-if="!collapsed" class="truncate text-white">{{ userCookie?.nombre || 'Usuario' }}</span>
              <UIcon v-if="!collapsed" name="i-lucide-chevron-down" class="ml-auto size-4" />
            </UButton>
          </UDropdownMenu>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
