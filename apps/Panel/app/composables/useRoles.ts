import { useApi } from './useApi'

export interface Role {
  id_rol: string
  nombre: string
}

export const useRoles = () => {
  const { fetchApi } = useApi()

  const getRoles = async () => {
    return await fetchApi<Role[]>('/usuarios/roles')
  }

  const createRole = async (role: Partial<Role>) => {
    return await fetchApi<Role>('/usuarios/roles', {
      method: 'POST',
      body: role
    })
  }

  return {
    getRoles,
    createRole
  }
}
