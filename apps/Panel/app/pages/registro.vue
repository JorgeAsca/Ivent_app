<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: false })

const router = useRouter()
const toast = useToast()
const { fetchApi } = useApi()

const nombre_legal = ref('')
const nombre_comercial = ref('')
const nif_cif = ref('')
const nombre_usuario = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const authToken = useCookie('auth_token', { maxAge: 60 * 60 * 24, path: '/' })
const userCookie = useCookie('user_data', { maxAge: 60 * 60 * 24, path: '/' })

async function handleRegistro() {
  if (!nombre_legal.value || !nif_cif.value || !email.value || !password.value || !nombre_usuario.value) {
    toast.add({
      title: 'Error',
      description: 'Por favor, completa los campos obligatorios.',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  try {
    const response = await fetchApi<any>('/auth/registro', {
      method: 'POST',
      body: { 
        nombre_legal: nombre_legal.value, 
        nombre_comercial: nombre_comercial.value || nombre_legal.value, 
        nif_cif: nif_cif.value,
        nombre_usuario: nombre_usuario.value,
        email: email.value,
        password: password.value
      }
    })

    if (response && response.access_token) {
      authToken.value = response.access_token
      userCookie.value = response.usuario

      toast.add({
        title: 'Empresa Registrada',
        description: 'Tu empresa y cuenta han sido creadas con éxito.',
        color: 'success'
      })
      
      router.push('/dashboard')
    }
  } catch (error: any) {
    toast.add({
      title: 'Error en el Registro',
      description: error.message || 'Ocurrió un error al registrar la empresa.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <div class="w-full max-w-xl">
      
      <div class="mb-8 flex flex-col items-center justify-center gap-2 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <UIcon name="i-lucide-building-2" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Registrar Empresa</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Crea tu espacio de trabajo y cuenta de administrador</p>
      </div>

      <UCard>
        <form @submit.prevent="handleRegistro" class="flex flex-col gap-5">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Nombre Legal de la Empresa *" name="nombre_legal">
              <UInput v-model="nombre_legal" placeholder="Ej: Mi Empresa S.A." class="w-full" />
            </UFormField>

            <UFormField label="Nombre Comercial" name="nombre_comercial">
              <UInput v-model="nombre_comercial" placeholder="Ej: MiEmpresa" class="w-full" />
            </UFormField>

            <UFormField label="NIF / CIF / RUT *" name="nif_cif">
              <UInput v-model="nif_cif" placeholder="Ej: A12345678" class="w-full" />
            </UFormField>
          </div>

          <UDivider label="Datos del Administrador" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Tu Nombre *" name="nombre_usuario">
              <UInput v-model="nombre_usuario" placeholder="Ej: Juan Pérez" class="w-full" />
            </UFormField>

            <UFormField label="Correo Electrónico *" name="email">
              <UInput v-model="email" type="email" placeholder="juan@empresa.com" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Contraseña *" name="password">
            <UInput 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
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

          <UButton type="submit" block size="lg" :loading="isLoading" label="Crear Cuenta y Empresa" />
          
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes una cuenta? 
            <NuxtLink href="/login" class="font-medium text-primary hover:underline">Inicia sesión</NuxtLink>
          </p>
        </template>
      </UCard>
      
    </div>
  </div>
</template>
