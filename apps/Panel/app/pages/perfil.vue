<script setup lang="ts">
import { useCookie, useToast } from '#imports'
import { useUsuarios } from '~/composables/useUsuarios'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { getUsuarios } = useUsuarios()
const userCookie = useCookie('user_data')

const localUser = ref<any>(null)

const currentUser = computed(() => {
  if (localUser.value) return localUser.value
  
  if (!userCookie.value) return null
  
  try {
    return typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value
  } catch (e) {
    return userCookie.value
  }
})

const userPermissions = computed(() => {
  if (!currentUser.value?.rol?.permisos) return []
  return currentUser.value.rol.permisos.map((p: any) => p.nombre || p)
})

onMounted(async () => {
  if (currentUser.value?.id_usuario) {
    try {
      const users = await getUsuarios()
      const found = users?.find(u => u.id_usuario === currentUser.value.id_usuario)
      if (found) {
        localUser.value = found
        // Update cookie transparently
        userCookie.value = found as any
      }
    } catch (e) {
      console.error('Failed to refresh user data', e)
    }
  }
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Mi Perfil" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
        
        <UCard class="w-full relative overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-primary-500 to-primary-700 absolute top-0 left-0 w-full opacity-20"></div>
          
          <div class="relative pt-8 flex flex-col items-center gap-4">
            <UAvatar 
              :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentUser?.nombre || 'User'}`" 
              :alt="currentUser?.nombre" 
              size="3xl"
              class="ring-4 ring-white dark:ring-gray-900"
            />
            
            <div class="text-center">
              <h2 class="text-2xl font-bold text-default">{{ currentUser?.nombre || 'Usuario' }}</h2>
              <p class="text-muted">{{ currentUser?.email }}</p>
            </div>
            
            <div class="mt-2 flex gap-2">
              <UBadge size="lg" color="primary" variant="subtle">
                <UIcon name="i-lucide-shield" class="mr-1 size-4" />
                {{ currentUser?.rol?.nombre || 'Sin Rol Asignado' }}
              </UBadge>
              <UBadge v-if="currentUser?.rol?.isSystem" size="lg" color="amber" variant="subtle" label="Rol de Sistema" />
            </div>
          </div>
          
          <USeparator class="my-8" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold flex items-center gap-2 mb-4 text-default">
                <UIcon name="i-lucide-user" class="size-5 text-primary" />
                Datos Personales
              </h3>
              
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-muted">ID de Usuario</p>
                  <p class="font-mono text-sm text-default bg-muted/50 p-2 rounded mt-1">{{ currentUser?.id_usuario }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted">ID de Empresa</p>
                  <p class="font-mono text-sm text-default bg-muted/50 p-2 rounded mt-1">{{ currentUser?.empresaId }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted">Estado</p>
                  <p class="mt-1"><UBadge color="success" variant="soft" label="Activo" /></p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold flex items-center gap-2 mb-4 text-default">
                <UIcon name="i-lucide-key" class="size-5 text-primary" />
                Permisos Autorizados
              </h3>
              
              <div v-if="userPermissions.length > 0" class="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <UBadge 
                  v-for="perm in userPermissions" 
                  :key="perm"
                  color="info" 
                  variant="outline"
                >
                  {{ perm }}
                </UBadge>
              </div>
              <div v-else class="text-sm text-muted p-4 border border-dashed rounded-lg text-center">
                Este rol no tiene permisos explícitos asignados o no se han cargado.
              </div>
            </div>
          </div>
        </UCard>
        
      </div>
    </template>
  </UDashboardPanel>
</template>
