<script setup lang="ts">
import { useApi } from '~/composables/useApi'

// Deshabilitar el layout del dashboard para esta página
definePageMeta({ layout: false })

const router = useRouter()
const toast = useToast()
const { fetchApi } = useApi()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const authToken = useCookie('auth_token', { maxAge: 60 * 60 * 24, path: '/' }) // 1 day
const userCookie = useCookie('user_data', { maxAge: 60 * 60 * 24, path: '/' })

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Por favor, completa todos los campos.',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  try {
    const response = await fetchApi<any>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    if (response && response.access_token) {
      authToken.value = response.access_token
      userCookie.value = response.usuario

      toast.add({
        title: 'Bienvenido',
        description: 'Has iniciado sesión correctamente.',
        color: 'success'
      })
      
      router.push('/dashboard')
    } else {
      throw new Error('Credenciales inválidas')
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Error al iniciar sesión. Verifica tus credenciales.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <div class="w-full max-w-md">
      
      <!-- Logo o Título -->
      <div class="mb-8 flex flex-col items-center justify-center gap-2 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <UIcon name="i-lucide-box" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">InventoryPro</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Ingresa a tu cuenta para continuar</p>
      </div>

      <!-- Tarjeta de Login -->
      <UCard>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          
          <UFormField label="Correo electrónico" name="email">
            <UInput 
              v-model="email" 
              type="email" 
              placeholder="tu@email.com" 
              icon="i-lucide-mail" 
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Contraseña" name="password">
            <UInput 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              icon="i-lucide-lock"
              autocomplete="current-password"
              class="w-full"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  color="gray"
                  variant="link"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :padded="false"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox name="remember" />
              <span class="text-gray-600 dark:text-gray-300">Recordarme</span>
            </label>
            <a href="#" class="font-medium text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <UButton 
            type="submit" 
            block 
            size="lg" 
            :loading="isLoading"
            label="Iniciar sesión"
          />
          
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta? 
            <NuxtLink href="/registro" class="font-medium text-primary hover:underline">Regístrate como Empresa</NuxtLink>
          </p>
        </template>
      </UCard>
      
    </div>
  </div>
</template>
