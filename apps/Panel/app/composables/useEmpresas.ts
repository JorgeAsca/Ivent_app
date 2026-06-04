import { useApi } from './useApi'

export interface Empresa {
  id_empresa: string
  nombre_legal: string
  nombre_comercial: string
  nif_cif: string
}

export const useEmpresas = () => {
  const { fetchApi } = useApi()

  const getEmpresas = async () => {
    return await fetchApi<Empresa[]>('/administracion/empresas')
  }

  return {
    getEmpresas
  }
}
