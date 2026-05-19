<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()

// General Settings
const companyName = ref('Mi Empresa S.L.')
const companyEmail = ref('admin@miempresa.com')
const currency = ref('EUR')
const timezone = ref('Europe/Madrid')

// Inventory Settings
const lowStockAlert = ref(true)
const autoReorder = ref(false)
const defaultMinStock = ref(10)
const barcodeEnabled = ref(true)

// Notification Settings
const emailNotifications = ref(true)
const stockAlertEmail = ref(true)
const dailyReport = ref(false)
const weeklyReport = ref(true)

const currencyOptions = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dolar (USD)' },
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
  { value: 'COP', label: 'Peso Colombiano (COP)' },
]

const timezoneOptions = [
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/London', label: 'Londres (GMT)' },
  { value: 'America/Mexico_City', label: 'Ciudad de Mexico (GMT-6)' },
  { value: 'America/Bogota', label: 'Bogota (GMT-5)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
]

const settingsSections = [
  { id: 'general', label: 'General', icon: 'i-lucide-settings' },
  { id: 'inventory', label: 'Inventario', icon: 'i-lucide-package' },
  { id: 'notifications', label: 'Notificaciones', icon: 'i-lucide-bell' },
  { id: 'users', label: 'Usuarios', icon: 'i-lucide-users' },
  { id: 'integrations', label: 'Integraciones', icon: 'i-lucide-plug' },
]

const activeSection = ref('general')

function saveSettings() {
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
        <!-- Sidebar Navigation -->
        <div class="w-64 border-r border-default bg-elevated p-4">
          <nav class="space-y-1">
            <button
              v-for="section in settingsSections"
              :key="section.id"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors"
              :class="activeSection === section.id ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted hover:text-default'"
              @click="activeSection = section.id"
            >
              <UIcon :name="section.icon" class="size-5" />
              <span>{{ section.label }}</span>
            </button>
          </nav>
        </div>

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
                <UFormField label="Nombre de la Empresa" name="companyName">
                  <UInput v-model="companyName" />
                </UFormField>

                <UFormField label="Email de Contacto" name="companyEmail">
                  <UInput v-model="companyEmail" type="email" />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="Moneda" name="currency">
                    <USelectMenu v-model="currency" :items="currencyOptions" value-key="value" />
                  </UFormField>

                  <UFormField label="Zona Horaria" name="timezone">
                    <USelectMenu v-model="timezone" :items="timezoneOptions" value-key="value" />
                  </UFormField>
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
                    <p class="font-medium text-default">Alertas de Stock Bajo</p>
                    <p class="text-sm text-muted">Recibir notificaciones cuando el stock este bajo</p>
                  </div>
                  <USwitch v-model="lowStockAlert" />
                </div>

                <USeparator />

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

          <!-- Users Settings -->
          <div v-if="activeSection === 'users'" class="max-w-2xl space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-default">Usuarios</h2>
              <p class="text-sm text-muted">Gestiona los usuarios del sistema</p>
            </div>

            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-default">Usuarios Activos</span>
                  <UButton icon="i-lucide-user-plus" label="Invitar Usuario" size="sm" />
                </div>
              </template>
              <div class="space-y-4">
                <div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div class="flex items-center gap-3">
                    <UAvatar src="https://api.dicebear.com/9.x/avataaars/svg?seed=admin" alt="Admin" size="sm" />
                    <div>
                      <p class="font-medium text-default">Administrador</p>
                      <p class="text-sm text-muted">admin@miempresa.com</p>
                    </div>
                  </div>
                  <UBadge label="Admin" color="primary" variant="subtle" />
                </div>
                <div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div class="flex items-center gap-3">
                    <UAvatar src="https://api.dicebear.com/9.x/avataaars/svg?seed=carlos" alt="Carlos" size="sm" />
                    <div>
                      <p class="font-medium text-default">Carlos Rodriguez</p>
                      <p class="text-sm text-muted">carlos@miempresa.com</p>
                    </div>
                  </div>
                  <UBadge label="Almacenero" color="neutral" variant="subtle" />
                </div>
                <div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div class="flex items-center gap-3">
                    <UAvatar src="https://api.dicebear.com/9.x/avataaars/svg?seed=ana" alt="Ana" size="sm" />
                    <div>
                      <p class="font-medium text-default">Ana Lopez</p>
                      <p class="text-sm text-muted">ana@miempresa.com</p>
                    </div>
                  </div>
                  <UBadge label="Supervisor" color="info" variant="subtle" />
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
</template>
