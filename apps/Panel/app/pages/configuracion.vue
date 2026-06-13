<script setup lang="ts">
import { useUsuarios, type Usuario } from '~/composables/useUsuarios'
import { useRoles, type Role } from '~/composables/useRoles'
import { useEmpresas, type Empresa } from '~/composables/useEmpresas'
import { useConfiguracion } from '~/composables/useConfiguracion'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()

const { getUsuarios, createUsuario, deleteUsuario } = useUsuarios()
const { getRoles } = useRoles()
const { getEmpresas, deleteEmpresa } = useEmpresas()
const { getGlobalConfigs, upsertGlobalConfig } = useConfiguracion()


// General Settings
const companyLegalName = ref('')
const companyCommercialName = ref('')
const companyNif = ref('')
const companyEmail = ref('')
const userCookie = useCookie('user_data')
const currentUser = computed(() => {
  if (!userCookie.value) return null
  try {
    return typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value
  } catch (e) {
    return userCookie.value
  }
})
const isSuperAdmin = computed(() => {
  const roleName = currentUser.value?.rol?.nombre?.toLowerCase()
  return roleName === 'superadmin' || roleName === 'admin' || !currentUser.value?.rolId
})

// Inventory Settings
const lowStockAlert = ref(true)
const autoReorder = ref(false)
const defaultMinStock = ref(10)
const barcodeEnabled = ref(true)

// Notification Settings
const emailNotifications = ref(true)
const stockAlertEmail = ref(true)
const alertUserIds = ref<string[]>([])
const selectedAlertUsers = computed({
  get: () => usuarios.value.filter(u => alertUserIds.value.includes(u.id_usuario)),
  set: (users) => {
    alertUserIds.value = users.map(u => u.id_usuario)
  }
})
const dailyReport = ref(false)
const weeklyReport = ref(true)

const settingsSections = [
  { id: 'general', label: 'General', icon: 'i-lucide-settings' },
  { id: 'inventory', label: 'Inventario', icon: 'i-lucide-package' },
  { id: 'notifications', label: 'Notificaciones', icon: 'i-lucide-bell' },
  { id: 'integrations', label: 'Integraciones', icon: 'i-lucide-plug' },
]

const route = useRoute()
const router = useRouter()

const activeSection = computed(() => (route.query.section as string) || 'general')

// Users Logic
const usuarios = ref<Usuario[]>([])
const rolesList = ref<Role[]>([])
const empresas = ref<Empresa[]>([])


const isDeleteCompanyModalOpen = ref(false)
const deleteCompanyNameInput = ref('')

function openDeleteCompanyModal() {
  deleteCompanyNameInput.value = ''
  isDeleteCompanyModalOpen.value = true
}

async function confirmDeleteCompany() {
  if (deleteCompanyNameInput.value !== companyLegalName.value) {
    toast.add({ title: 'El nombre no coincide', color: 'error' })
    return
  }
  
  if (empresas.value.length > 0) {
    try {
      await deleteEmpresa(empresas.value[0].id_empresa)
      toast.add({ title: 'Empresa eliminada y sesión cerrada', color: 'success' })
      isDeleteCompanyModalOpen.value = false
      setTimeout(() => {
        userCookie.value = null
        const authToken = useCookie('auth_token')
        authToken.value = null
        window.location.href = '/login'
      }, 1000)
    } catch(err: any) {
      toast.add({ title: 'Error eliminando empresa', description: err.message, color: 'error' })
    }
  }
}

async function loadUsersAndRoles() {
  try {
    const [dataUsers, dataRoles, dataEmpresas] = await Promise.all([
      getUsuarios(),
      getRoles(),
      getEmpresas()
    ])
    if (dataUsers) usuarios.value = dataUsers
    if (dataRoles) rolesList.value = dataRoles
    if (dataEmpresas && dataEmpresas.length > 0) {
      empresas.value = dataEmpresas
      companyLegalName.value = dataEmpresas[0].nombre_legal || ''
      companyCommercialName.value = dataEmpresas[0].nombre_comercial || ''
      companyNif.value = dataEmpresas[0].nif_cif || ''
      companyEmail.value = dataEmpresas[0].email_contacto || ''
    }
  } catch (error) {
    console.error('Error cargando usuarios/roles/empresas:', error)
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
}

async function loadConfigs() {
  const configs = await getGlobalConfigs();
  const configMap = configs.reduce((acc: any, c: any) => {
    acc[c.clave] = c.valor;
    return acc;
  }, {});

  if (configMap['USUARIOS_ALERTAS_STOCK']) {
    alertUserIds.value = configMap['USUARIOS_ALERTAS_STOCK'].split(',').map((i: string) => i.trim());
  }
  if (configMap['NOTIFICACIONES_EMAIL']) emailNotifications.value = configMap['NOTIFICACIONES_EMAIL'] === 'true';
  if (configMap['NOTIFICACIONES_ALERTAS_STOCK']) stockAlertEmail.value = configMap['NOTIFICACIONES_ALERTAS_STOCK'] === 'true';
  if (configMap['NOTIFICACIONES_REPORTE_DIARIO']) dailyReport.value = configMap['NOTIFICACIONES_REPORTE_DIARIO'] === 'true';
  if (configMap['NOTIFICACIONES_REPORTE_SEMANAL']) weeklyReport.value = configMap['NOTIFICACIONES_REPORTE_SEMANAL'] === 'true';
  if (configMap['STOCK_MINIMO_DEFECTO']) {
    defaultMinStock.value = parseInt(configMap['STOCK_MINIMO_DEFECTO'], 10);
  }
}

onMounted(() => {
  loadConfigs();
  loadUsersAndRoles(); // Load users always so we can show them in the notifications tab
})

async function saveSettings() {
  if (activeSection.value === 'notifications') {
    await Promise.all([
      upsertGlobalConfig('USUARIOS_ALERTAS_STOCK', alertUserIds.value.join(',')),
      upsertGlobalConfig('NOTIFICACIONES_EMAIL', emailNotifications.value.toString()),
      upsertGlobalConfig('NOTIFICACIONES_ALERTAS_STOCK', stockAlertEmail.value.toString()),
      upsertGlobalConfig('NOTIFICACIONES_REPORTE_DIARIO', dailyReport.value.toString()),
      upsertGlobalConfig('NOTIFICACIONES_REPORTE_SEMANAL', weeklyReport.value.toString()),
    ]);
  } else if (activeSection.value === 'inventory') {
    await Promise.all([
      upsertGlobalConfig('STOCK_MINIMO_DEFECTO', defaultMinStock.value.toString()),
    ]);
  } else if (activeSection.value === 'general') {
    const { updateEmpresa } = useEmpresas()
    if (empresas.value.length > 0 && isSuperAdmin.value) {
      await updateEmpresa(empresas.value[0].id_empresa, {
        nombre_legal: companyLegalName.value,
        nombre_comercial: companyCommercialName.value,
        email_contacto: companyEmail.value,
        nif_cif: companyNif.value
      })
    }
  }
  toast.add({ title: 'Configuracion guardada', icon: 'i-lucide-check', color: 'success' })
}
</script>


<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Configuracion">
        <template #right>
          <UButton icon="i-lucide-save" label="Guardar Cambios" @click="saveSettings" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex min-h-full">
        <!-- Content Area -->
        <div class="flex-1 p-6">
          <!-- General Settings -->
          <div v-if="activeSection === 'general'" class="max-w-2xl space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-default">Configuracion General</h2>
              <p class="text-sm text-muted">Configura los datos basicos de tu empresa</p>
            </div>

            <UCard>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Nombre Legal" name="companyLegalName">
                    <UInput v-model="companyLegalName" :disabled="!isSuperAdmin" />
                  </UFormField>
                  
                  <UFormField label="Nombre Comercial" name="companyCommercialName">
                    <UInput v-model="companyCommercialName" :disabled="!isSuperAdmin" />
                  </UFormField>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="NIF / CIF / RUT" name="companyNif">
                    <UInput v-model="companyNif" :disabled="!isSuperAdmin" />
                  </UFormField>

                  <UFormField label="Email de Contacto" name="companyEmail">
                    <UInput v-model="companyEmail" type="email" :disabled="!isSuperAdmin" />
                  </UFormField>
                </div>
                
                <div v-if="!isSuperAdmin" class="text-sm text-amber-500 mt-2 flex items-center gap-2">
                  <UIcon name="i-lucide-lock" class="size-4" />
                  <span>Solo los administradores pueden editar esta información.</span>
                </div>
              </div>
            </UCard>
            
            <UCard v-if="isSuperAdmin" class="border-error bg-error/5">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2 text-error">
                  <UIcon name="i-lucide-alert-triangle" class="size-5" />
                  <h3 class="font-semibold">Zona de Peligro</h3>
                </div>
                <p class="text-sm text-muted">Eliminar tu empresa borrará permanentemente todos los usuarios, roles, inventario y datos asociados. Esta acción no se puede deshacer.</p>
                <div>
                  <UButton label="Eliminar Empresa" color="error" variant="soft" @click="openDeleteCompanyModal" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Inventory Settings -->
          <div v-if="activeSection === 'inventory'" class="max-w-2xl space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-default">Configuracion de Inventario</h2>
              <p class="text-sm text-muted">Personaliza el comportamiento del sistema de inventario</p>
            </div>

            <UCard>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Reorden Automatico</p>
                    <p class="text-sm text-muted">Crear ordenes de compra automaticamente</p>
                  </div>
                  <USwitch v-model="autoReorder" />
                </div>

                <USeparator />

                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Soporte de Codigo de Barras</p>
                    <p class="text-sm text-muted">Habilitar escaneo de codigos de barras</p>
                  </div>
                  <USwitch v-model="barcodeEnabled" />
                </div>

                <USeparator />

                <UFormField label="Stock Minimo por Defecto" name="defaultMinStock">
                  <UInput v-model.number="defaultMinStock" type="number" class="w-32" />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Notification Settings -->
          <div v-if="activeSection === 'notifications'" class="max-w-2xl space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-default">Notificaciones</h2>
              <p class="text-sm text-muted">Configura como y cuando recibir notificaciones</p>
            </div>

            <UCard>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Notificaciones por Email</p>
                    <p class="text-sm text-muted">Recibir notificaciones en tu correo</p>
                  </div>
                  <USwitch v-model="emailNotifications" />
                </div>

                <USeparator />

                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Alertas de Stock</p>
                    <p class="text-sm text-muted">Email cuando un producto tenga stock bajo</p>
                  </div>
                  <USwitch v-model="stockAlertEmail" :disabled="!emailNotifications" />
                </div>

                <UFormField v-if="stockAlertEmail" label="Usuarios que reciben las alertas" name="alertUserIds" description="Selecciona a los usuarios que seran notificados">
                  <USelectMenu 
                    v-model="selectedAlertUsers" 
                    :items="usuarios" 
                    label-key="nombre" 
                    multiple 
                    placeholder="Seleccionar usuarios" 
                  />
                </UFormField>

                <USeparator />
                
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Reporte Diario</p>
                    <p class="text-sm text-muted">Resumen diario de movimientos</p>
                  </div>
                  <USwitch v-model="dailyReport" :disabled="!emailNotifications" />
                </div>

                <USeparator />

                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-default">Reporte Semanal</p>
                    <p class="text-sm text-muted">Resumen semanal de inventario</p>
                  </div>
                  <USwitch v-model="weeklyReport" :disabled="!emailNotifications" />
                </div>
              </div>
            </UCard>
          </div>


          <!-- Integrations Settings -->
          <div v-if="activeSection === 'integrations'" class="max-w-2xl space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-default">Integraciones</h2>
              <p class="text-sm text-muted">Conecta con otros sistemas y servicios</p>
            </div>

            <div class="grid gap-4">
              <UCard>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-blue-500/10 p-2">
                      <UIcon name="i-lucide-database" class="size-6 text-blue-500" />
                    </div>
                    <div>
                      <p class="font-medium text-default">Base de Datos</p>
                      <p class="text-sm text-muted">Conectar con tu sistema de base de datos</p>
                    </div>
                  </div>
                  <UButton label="Configurar" variant="outline" color="neutral" />
                </div>
              </UCard>

              <UCard>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-green-500/10 p-2">
                      <UIcon name="i-lucide-shopping-cart" class="size-6 text-green-500" />
                    </div>
                    <div>
                      <p class="font-medium text-default">Sistema de Ventas (POS)</p>
                      <p class="text-sm text-muted">Sincronizar con punto de venta</p>
                    </div>
                  </div>
                  <UButton label="Configurar" variant="outline" color="neutral" />
                </div>
              </UCard>

              <UCard>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-amber-500/10 p-2">
                      <UIcon name="i-lucide-file-spreadsheet" class="size-6 text-amber-500" />
                    </div>
                    <div>
                      <p class="font-medium text-default">Importar/Exportar</p>
                      <p class="text-sm text-muted">Importar datos desde Excel o CSV</p>
                    </div>
                  </div>
                  <UButton label="Configurar" variant="outline" color="neutral" />
                </div>
              </UCard>

              <UCard>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-purple-500/10 p-2">
                      <UIcon name="i-lucide-webhook" class="size-6 text-purple-500" />
                    </div>
                    <div>
                      <p class="font-medium text-default">API / Webhooks</p>
                      <p class="text-sm text-muted">Configurar API para integraciones personalizadas</p>
                    </div>
                  </div>
                  <UButton label="Configurar" variant="outline" color="neutral" />
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>


  <!-- Delete Company Modal -->
  <UModal v-model:open="isDeleteCompanyModalOpen" title="¿Estás completamente seguro?">
    <template #body>
      <div class="flex flex-col gap-4">
        <p class="text-sm text-muted">Esta acción es irreversible y borrará absolutamente todo. Para confirmar, por favor escribe el nombre legal de tu empresa: <strong class="text-default">{{ companyLegalName }}</strong></p>
        <UFormField label="Confirmar nombre" name="confirmName">
          <UInput v-model="deleteCompanyNameInput" :placeholder="companyLegalName" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isDeleteCompanyModalOpen = false" />
        <UButton label="Eliminar Definitivamente" color="error" @click="confirmDeleteCompany" :disabled="deleteCompanyNameInput !== companyLegalName" />
      </div>
    </template>
  </UModal>
</template>

