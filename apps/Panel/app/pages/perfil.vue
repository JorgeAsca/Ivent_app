<script setup lang="ts">
import { useUsuarios, type Usuario } from '~/composables/useUsuarios'
import { useRoles, type Role } from '~/composables/useRoles'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isUserModalOpen = ref(false)
const isRoleModalOpen = ref(false)

const { getUsuarios, createUsuario } = useUsuarios()
const { getRoles, createRole } = useRoles()

const usuarios = ref<Usuario[]>([])
const roles = ref<Role[]>([])

onMounted(async () => {
  try {
    const [dataUsers, dataRoles] = await Promise.all([
      getUsuarios(),
      getRoles()
    ])
    if (dataUsers) usuarios.value = dataUsers
    if (dataRoles) roles.value = dataRoles
  } catch (error) {
    toast.add({ title: 'Error cargando datos de perfil', color: 'error' })
  }
})

const currentUser = ref<Partial<Usuario>>({
  nombre: '',
  email: '',
  password: '',
  rolId: '',
  empresaId: '' // Required valid UUID from ms-administracion
})

const currentRole = ref<Partial<Role>>({
  nombre: ''
})

const columnsUsuarios = [
  { accessorKey: 'id_usuario', header: 'ID Usuario' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'rol', header: 'Rol' }
]

function openNewUserModal() {
  currentUser.value = {
    nombre: '',
    email: '',
    password: '',
    rolId: '',
    empresaId: ''
  }
  isUserModalOpen.value = true
}

function openNewRoleModal() {
  currentRole.value = { nombre: '' }
  isRoleModalOpen.value = true
}

async function saveUser() {
  try {
    const payload = { ...currentUser.value }
    const created = await createUsuario(payload)
    if (created) {
      usuarios.value.push(created)
      toast.add({ title: 'Usuario creado', icon: 'i-lucide-check', color: 'success' })
      isUserModalOpen.value = false
    }
  } catch (error: any) {
    console.error('Error guardando usuario:', error)
    toast.add({ title: 'Error al crear usuario', description: error.message || 'Verifica que la Empresa ID exista.', color: 'error' })
  }
}

async function saveRole() {
  try {
    const payload = { nombre: currentRole.value.nombre }
    const created = await createRole(payload)
    if (created) {
      roles.value.push(created)
      toast.add({ title: 'Rol creado', icon: 'i-lucide-check', color: 'success' })
      isRoleModalOpen.value = false
    }
  } catch (error: any) {
    console.error('Error guardando rol:', error)
    toast.add({ title: 'Error al crear rol', description: error.message, color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Gestión de Usuarios y Roles" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Usuarios de la Empresa</h3>
              <div class="flex gap-2">
                <UButton icon="i-lucide-shield" label="Añadir Rol" variant="soft" color="primary" @click="openNewRoleModal" />
                <UButton icon="i-lucide-user-plus" label="Añadir Empleado" @click="openNewUserModal" />
              </div>
            </div>
          </template>
          
          <UTable :data="usuarios" :columns="columnsUsuarios">
            <template #rol-cell="{ row }">
              <UBadge
                color="info"
                :label="row.original.rol?.nombre || 'Sin rol'"
                variant="subtle"
              />
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- User Modal -->
  <UModal v-model:open="isUserModalOpen" title="Nuevo Empleado">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre Completo" name="nombre">
          <UInput v-model="currentUser.nombre" placeholder="Ej: Ana Lopez" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="currentUser.email" type="email" placeholder="email@ejemplo.com" />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput v-model="currentUser.password" type="password" placeholder="Contraseña segura" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Rol" name="rolId">
            <USelectMenu 
              v-model="currentUser.rolId" 
              :items="roles" 
              value-key="id_rol"
              label-key="nombre"
              placeholder="Seleccionar Rol" 
            />
          </UFormField>
          
          <UFormField label="ID Empresa" name="empresaId">
            <UInput v-model="currentUser.empresaId" placeholder="UUID de la empresa" />
            <p class="mt-1 text-xs text-muted">Debe existir en ms-administracion</p>
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isUserModalOpen = false" />
        <UButton label="Crear Empleado" @click="saveUser" />
      </div>
    </template>
  </UModal>

  <!-- Role Modal -->
  <UModal v-model:open="isRoleModalOpen" title="Nuevo Rol">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre del Rol" name="nombre">
          <UInput v-model="currentRole.nombre" placeholder="Ej: Vendedor, Administrador" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isRoleModalOpen = false" />
        <UButton label="Crear Rol" @click="saveRole" />
      </div>
    </template>
  </UModal>
</template>
