<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

// Datos provisionales basados en la estructura Prisma requerida

const roles = ref([
  { id_rol: 'ROL-001', id_empresa: 'EMP-001', nombre: 'Administrador' },
  { id_rol: 'ROL-002', id_empresa: 'EMP-001', nombre: 'Jefe' },
  { id_rol: 'ROL-003', id_empresa: 'EMP-001', nombre: 'Empleado' },
])

const columnsRoles = [
  { accessorKey: 'id_rol', header: 'ID Rol' },
  { accessorKey: 'nombre', header: 'Nombre del Rol' },
  { accessorKey: 'id_empresa', header: 'ID Empresa' }
]

const permisos = ref([
  { id_permiso: 'PERM-001', id_usuario: 'USR-001', recurso: 'productos', accion: 'crear,leer,actualizar,eliminar' },
  { id_permiso: 'PERM-002', id_usuario: 'USR-001', recurso: 'configuracion', accion: 'todo' },
  { id_permiso: 'PERM-003', id_usuario: 'USR-002', recurso: 'productos', accion: 'crear,leer,actualizar' },
  { id_permiso: 'PERM-004', id_usuario: 'USR-003', recurso: 'productos', accion: 'leer' },
])

const columnsPermisos = [
  { accessorKey: 'id_permiso', header: 'ID Permiso' },
  { accessorKey: 'id_usuario', header: 'ID Usuario' },
  { accessorKey: 'recurso', header: 'Recurso' },
  { accessorKey: 'accion', header: 'Acciones Permitidas' }
]

const rolPermisos = ref([
  { id_rol: 'ROL-001', id_empresa: 'EMP-001', id_rol_fk: 'TODOS LOS PERMISOS' },
  { id_rol: 'ROL-002', id_empresa: 'EMP-001', id_rol_fk: 'GESTION_BASICA' },
  { id_rol: 'ROL-003', id_empresa: 'EMP-001', id_rol_fk: 'SOLO_LECTURA' },
])

const columnsRolPermiso = [
  { accessorKey: 'id_rol', header: 'ID Rol' },
  { accessorKey: 'id_rol_fk', header: 'Permisos Asignados (FK)' },
]

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Preferencias - Roles y Permisos" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        
        <div class="mb-4">
          <p class="text-sm text-muted">
            Vista provisional: Define jefe y empleados, controlando qué puede ver cada uno a través de Roles y Permisos.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Roles Table -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-default">Roles</h3>
                <UButton icon="i-lucide-plus" size="sm" variant="ghost" label="Nuevo Rol" />
              </div>
            </template>
            <UTable :data="roles" :columns="columnsRoles" />
          </UCard>

          <!-- Rol_permiso Table -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-default">Asignacion Rol-Permiso</h3>
                <UButton icon="i-lucide-link" size="sm" variant="ghost" label="Asignar" />
              </div>
            </template>
            <UTable :data="rolPermisos" :columns="columnsRolPermiso" />
          </UCard>
        </div>

        <!-- Permisos Table -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Permisos Individuales / Por Usuario</h3>
              <UButton icon="i-lucide-shield" size="sm" variant="ghost" label="Añadir Permiso" />
            </div>
          </template>
          <UTable :data="permisos" :columns="columnsPermisos">
            <template #accion-cell="{ row }">
              <div class="flex flex-wrap gap-1">
                <UBadge 
                  v-for="accion in row.original.accion.split(',')" 
                  :key="accion"
                  color="primary" 
                  variant="subtle" 
                  :label="accion" 
                />
              </div>
            </template>
          </UTable>
        </UCard>

      </div>
    </template>
  </UDashboardPanel>
</template>
