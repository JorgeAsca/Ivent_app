<script setup lang="ts">
import { useRoles, type Role } from '~/composables/useRoles'
import { usePermisos, type Permiso } from '~/composables/usePermisos'
import { useUsuarios, type Usuario } from '~/composables/useUsuarios'
import { useEmpresas, type Empresa } from '~/composables/useEmpresas'
import { usePermissions } from '~/composables/usePermissions'

definePageMeta({ layout: 'dashboard' })

const { hasPermission, isSuperAdmin } = usePermissions()

const toast = useToast()
const { getRoles, createRole, updateRole, deleteRole: removeRole } = useRoles()
const { getPermisos } = usePermisos()
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario: removeUsuario } = useUsuarios()
const { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa: removeEmpresa } = useEmpresas()

const usuarios = ref<Usuario[]>([])
const empresas = ref<Empresa[]>([])
const isUserModalOpen = ref(false)
const isEditingUser = ref(false)
const isEmpresaModalOpen = ref(false)
const isEditingEmpresa = ref(false)
const showPassword = ref(false)

const currentUserForm = ref<Partial<Usuario>>({
  nombre: '', email: '', password: '', rolId: '', empresaId: ''
})

const currentEmpresa = ref<Partial<Empresa>>({
  nombre_legal: '', nombre_comercial: '', nif_cif: ''
})

const columnsUsuarios = [
  { accessorKey: 'id_usuario', header: 'ID Usuario' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'rol', header: 'Rol' },
  { id: 'actions', header: '' }
]

const columnsEmpresas = [
  { accessorKey: 'id_empresa', header: 'ID Empresa' },
  { accessorKey: 'nombre_legal', header: 'Nombre Legal' },
  { accessorKey: 'nombre_comercial', header: 'Nombre Comercial' },
  { accessorKey: 'nif_cif', header: 'NIF/CIF' },
  { id: 'actions', header: '' }
]

const roles = ref<Role[]>([])
const permisos = ref<Permiso[]>([])
const isModalOpen = ref(false)
const isEditing = ref(false)
const isReadOnly = ref(false)

const currentRole = ref<Partial<Role>>({
  nombre: '',
  permisos: []
})

// Store checked permissions by name
const selectedPermisos = ref<Record<string, boolean>>({})

onMounted(async () => {
  try {
    const [dataRoles, dataPermisos, dataUsers, dataEmpresas] = await Promise.all([
      getRoles(),
      getPermisos(),
      getUsuarios(),
      getEmpresas()
    ])
    if (dataRoles) roles.value = dataRoles
    if (dataPermisos) permisos.value = dataPermisos
    if (dataUsers) usuarios.value = dataUsers
    if (dataEmpresas) empresas.value = dataEmpresas
  } catch (error) {
    toast.add({ title: 'Error cargando datos de preferencias', color: 'error' })
  }
})

// === USER METHODS ===
function openNewUserModal() {
  isEditingUser.value = false
  showPassword.value = false
  currentUserForm.value = {
    nombre: '', email: '', password: '', rolId: '', empresaId: empresas.value[0]?.id_empresa || ''
  }
  isUserModalOpen.value = true
}

function openEditUserModal(user: Usuario) {
  isEditingUser.value = true
  showPassword.value = false
  currentUserForm.value = { ...user, rolId: user.rol?.id_rol || user.rolId }
  isUserModalOpen.value = true
}

async function saveUser() {
  try {
    const payload = { ...currentUserForm.value }
    if (isEditingUser.value && currentUserForm.value.id_usuario) {
      if (!payload.password) delete payload.password;
      const updated = await updateUsuario(currentUserForm.value.id_usuario, payload)
      if (updated) {
        const index = usuarios.value.findIndex(u => u.id_usuario === currentUserForm.value.id_usuario)
        if (index !== -1) usuarios.value[index] = updated
        toast.add({ title: 'Usuario actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createUsuario(payload)
      if (created) {
        usuarios.value.push(created)
        toast.add({ title: 'Usuario creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isUserModalOpen.value = false
  } catch (error: any) {
    toast.add({ title: 'Error al guardar usuario', description: error.message || 'Verifica los datos.', color: 'error' })
  }
}

async function deleteUser(id: string) {
  try {
    await removeUsuario(id)
    usuarios.value = usuarios.value.filter(u => u.id_usuario !== id)
    toast.add({ title: 'Usuario eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar usuario', color: 'error' })
  }
}

// === EMPRESA METHODS ===
function openNewEmpresaModal() {
  isEditingEmpresa.value = false
  currentEmpresa.value = { nombre_legal: '', nombre_comercial: '', nif_cif: '' }
  isEmpresaModalOpen.value = true
}

function openEditEmpresaModal(empresa: Empresa) {
  isEditingEmpresa.value = true
  currentEmpresa.value = { ...empresa }
  isEmpresaModalOpen.value = true
}

async function saveEmpresa() {
  try {
    const payload = { ...currentEmpresa.value }
    if (isEditingEmpresa.value && currentEmpresa.value.id_empresa) {
      const updated = await updateEmpresa(currentEmpresa.value.id_empresa, payload)
      if (updated) {
        const index = empresas.value.findIndex(e => e.id_empresa === currentEmpresa.value.id_empresa)
        if (index !== -1) empresas.value[index] = updated
        toast.add({ title: 'Empresa actualizada', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createEmpresa(payload)
      if (created) {
        empresas.value.push(created)
        toast.add({ title: 'Empresa creada', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isEmpresaModalOpen.value = false
  } catch (error: any) {
    toast.add({ title: 'Error al guardar empresa', description: error.message, color: 'error' })
  }
}

const columnsRoles = [
  { accessorKey: 'id_rol', header: 'ID Rol' },
  { accessorKey: 'nombre', header: 'Nombre del Rol' },
  { accessorKey: 'permisosCount', header: 'Nº Permisos' },
  { id: 'actions', header: '' }
]

const filteredGroupedPermisos = computed(() => {
  const groups: Record<string, Permiso[]> = {}
  
  let permsToProcess = permisos.value
  
  // If read-only, only show active permissions
  if (isReadOnly.value && currentRole.value.permisos) {
    const activeNames = currentRole.value.permisos.map((p: any) => p.nombre)
    permsToProcess = permisos.value.filter(p => activeNames.includes(p.nombre))
  }

  for (const perm of permsToProcess) {
    const moduleName = perm.nombre.split(':')[0]
    if (!groups[moduleName]) {
      groups[moduleName] = []
    }
    groups[moduleName].push(perm)
  }
  return groups
})

function openNewRoleModal() {
  isEditing.value = false
  isReadOnly.value = false
  currentRole.value = { nombre: '' }
  selectedPermisos.value = {}
  isModalOpen.value = true
}

function openViewRoleModal(role: any) {
  isEditing.value = false
  isReadOnly.value = true
  currentRole.value = { ...role }
  selectedPermisos.value = {}
  if (role.permisos) {
    role.permisos.forEach((p: any) => {
      selectedPermisos.value[p.nombre] = true
    })
  }
  isModalOpen.value = true
}

function openEditRoleModal(role: any) {
  isEditing.value = true
  isReadOnly.value = false
  currentRole.value = { ...role }
  selectedPermisos.value = {}
  if (role.permisos) {
    role.permisos.forEach((p: any) => {
      selectedPermisos.value[p.nombre] = true
    })
  }
  isModalOpen.value = true
}

async function saveRole() {
  try {
    // Extract selected permission names
    const activePerms = Object.keys(selectedPermisos.value).filter(k => selectedPermisos.value[k])
    
    const payload = { 
      nombre: currentRole.value.nombre,
      permisos: activePerms
    }

    if (isEditing.value && currentRole.value.id_rol) {
      const updated = await updateRole(currentRole.value.id_rol, payload)
      if (updated) {
        const index = roles.value.findIndex(r => r.id_rol === currentRole.value.id_rol)
        if (index !== -1) roles.value[index] = updated
        toast.add({ title: 'Rol actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createRole(payload)
      if (created) {
        roles.value.push(created)
        toast.add({ title: 'Rol creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando rol:', error)
    toast.add({ title: 'Error al guardar rol', description: error.message, color: 'error' })
  }
}

async function deleteRole(id: string) {
  try {
    await removeRole(id)
    roles.value = roles.value.filter(r => r.id_rol !== id)
    toast.add({ title: 'Rol eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar rol', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Preferencias y Usuarios" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        
        <div class="mb-4">
          <p class="text-sm text-muted">
            Define los roles de la empresa y controla exactamente a qué módulos puede acceder cada empleado mediante los permisos.
          </p>
        </div>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Roles de la Empresa</h3>
              <UButton v-if="hasPermission('roles:crear')" icon="i-lucide-plus" label="Nuevo Rol" @click="openNewRoleModal" />
            </div>
          </template>
          
          <UTable :data="roles" :columns="columnsRoles">
            <template #nombre-cell="{ row }">
              <div class="flex items-center gap-2">
                <span>{{ row.original.nombre }}</span>
                <UBadge v-if="row.original.isSystem" color="primary" variant="subtle" size="sm" label="Sistema" />
              </div>
            </template>
            <template #permisosCount-cell="{ row }">
              <UBadge color="info" variant="subtle" :label="`${row.original.permisos?.length || 0} permisos`" />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Ver Permisos', icon: 'i-lucide-eye', onSelect: () => openViewRoleModal(row.original) }
                  ],
                  ...(hasPermission('roles:editar') ? [[{ label: 'Editar Accesos', icon: 'i-lucide-pencil', disabled: row.original.isSystem, onSelect: () => openEditRoleModal(row.original) }]] : []),
                  ...(hasPermission('roles:eliminar') ? [[{ label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, disabled: row.original.isSystem, onSelect: () => deleteRole(row.original.id_rol) }]] : []),
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <!-- USERS TABLE -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Usuarios de la Empresa</h3>
              <div class="flex gap-2">
                <UButton v-if="hasPermission('usuarios:crear')" icon="i-lucide-user-plus" label="Añadir Empleado" @click="openNewUserModal" />
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
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  ...(hasPermission('usuarios:editar') ? [[{ label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditUserModal(row.original) }]] : []),
                  ...(hasPermission('usuarios:eliminar') ? [[{ label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteUser(row.original.id_usuario) }]] : []),
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <!-- EMPRESAS TABLE -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Empresas Registradas</h3>
              <div class="flex gap-2">
                <UButton v-if="isSuperAdmin" icon="i-lucide-building" label="Añadir Empresa" @click="openNewEmpresaModal" />
              </div>
            </div>
          </template>
          
          <UTable :data="empresas" :columns="columnsEmpresas">
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  ...(isSuperAdmin ? [[{ label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditEmpresaModal(row.original) }]] : []),
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

      </div>
    </template>
  </UDashboardPanel>

  <!-- Role Slideover/Modal -->
  <USlideover v-model:open="isModalOpen" :title="isReadOnly ? 'Ver Accesos del Rol' : (isEditing ? 'Editar Accesos del Rol' : 'Crear Nuevo Rol')">
    <template #body>
      <div class="flex flex-col gap-6 p-4">
        <UFormField label="Nombre del Rol" name="nombre">
          <UInput v-model="currentRole.nombre" placeholder="Ej: Administrador, Vendedor VIP..." :disabled="isReadOnly" />
        </UFormField>

        <USeparator />

        <div>
          <h4 class="text-md font-semibold mb-4 text-default">Permisos Asignados</h4>
          <p class="text-sm text-muted mb-4">Activa o desactiva las acciones que los usuarios con este rol podrán realizar.</p>
          
          <div class="flex flex-col gap-6">
            <div v-for="(perms, moduleName) in filteredGroupedPermisos" :key="moduleName" class="border rounded-md p-4 bg-gray-50/50 dark:bg-gray-800/50">
              <h5 class="text-sm font-semibold uppercase tracking-wider mb-3 text-primary">{{ moduleName }}</h5>
              <div class="grid grid-cols-1 gap-3">
                <USwitch 
                  v-for="perm in perms" 
                  :key="perm.nombre"
                  v-model="selectedPermisos[perm.nombre]"
                  :label="perm.descripcion || perm.nombre"
                  :disabled="isReadOnly"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full mt-4 p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton variant="ghost" :label="isReadOnly ? 'Cerrar' : 'Cancelar'" @click="isModalOpen = false" />
        <UButton v-if="!isReadOnly" :label="isEditing ? 'Guardar Cambios' : 'Crear Rol'" @click="saveRole" />
      </div>
    </template>
  </USlideover>

  <!-- User Modal -->
  <UModal v-model:open="isUserModalOpen" :title="isEditingUser ? 'Editar Empleado' : 'Nuevo Empleado'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre Completo" name="nombre">
          <UInput v-model="currentUserForm.nombre" placeholder="Ej: Ana Lopez" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="currentUserForm.email" type="email" placeholder="email@ejemplo.com" />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput 
            v-model="currentUserForm.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Contraseña (dejar en blanco para no cambiar)" 
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

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Rol" name="rolId">
            <USelectMenu 
              v-model="currentUserForm.rolId" 
              :items="roles" 
              value-key="id_rol"
              label-key="nombre"
              placeholder="Seleccionar Rol" 
            />
          </UFormField>
          
          <UFormField label="Empresa" name="empresaId">
            <USelectMenu 
              v-model="currentUserForm.empresaId" 
              :items="empresas" 
              value-key="id_empresa"
              label-key="nombre_comercial"
              placeholder="Seleccionar Empresa" 
            />
          </UFormField>

        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isUserModalOpen = false" />
        <UButton :label="isEditingUser ? 'Guardar Cambios' : 'Crear Empleado'" @click="saveUser" />
      </div>
    </template>
  </UModal>

  <!-- Empresa Modal -->
  <UModal v-model:open="isEmpresaModalOpen" :title="isEditingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre Legal" name="nombre_legal">
          <UInput v-model="currentEmpresa.nombre_legal" placeholder="Ej: Mi Empresa S.L." />
        </UFormField>

        <UFormField label="Nombre Comercial" name="nombre_comercial">
          <UInput v-model="currentEmpresa.nombre_comercial" placeholder="Ej: Mi Empresa" />
        </UFormField>

        <UFormField label="NIF / CIF" name="nif_cif">
          <UInput v-model="currentEmpresa.nif_cif" placeholder="B12345678" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isEmpresaModalOpen = false" />
        <UButton :label="isEditingEmpresa ? 'Guardar Cambios' : 'Crear Empresa'" @click="saveEmpresa" />
      </div>
    </template>
  </UModal>
</template>
