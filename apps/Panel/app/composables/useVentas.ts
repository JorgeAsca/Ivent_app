import { useApi } from './useApi'

export interface CreateVentaDto {
  clienteId: string
  productoId: string
  cantidad: number
  total: number
  ticket_id?: string
}

export const useVentas = () => {
  const { fetchApi } = useApi()

  const createVenta = async (venta: CreateVentaDto) => {
    return await fetchApi<any>('/ventas', {
      method: 'POST',
      body: venta
    })
  }

  return {
    createVenta
  }
}
