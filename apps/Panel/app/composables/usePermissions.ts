export const usePermissions = () => {
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
    const roleName = currentUser.value?.rol?.nombre?.toLowerCase() || currentUser.value?.rolNombre?.toLowerCase()
    return roleName === 'superadmin' || roleName === 'admin'
  })

  const hasPermission = (permission: string) => {
    if (isSuperAdmin.value) return true
    
    // Si no tiene rol, no tiene permisos
    if (!currentUser.value?.rolId && !currentUser.value?.rol) return false
    
    const permisos = currentUser.value?.rol?.permisos || currentUser.value?.permisos || []
    return permisos.includes(permission)
  }

  return { hasPermission, isSuperAdmin, currentUser }
}
