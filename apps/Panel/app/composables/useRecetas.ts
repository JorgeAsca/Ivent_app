import { useApi } from './useApi'
import { type Product } from './useProducts'

export interface RecetaIngrediente {
  id: string
  producto_id: string
  ingrediente_id: string
  cantidad_necesaria: number
  id_empresa: string
  id_almacen?: string
  ingrediente?: Product
}

export interface CalculoRendimientoDetalle {
  ingrediente_id: string
  nombre: string
  unidadMedida: string
  stock_actual: number
  requerido_por_unidad: number
  posible_con_este: number
  limitante: boolean
  sobrante: number
}

export interface CalculoRendimiento {
  maxProduccion: number
  detalles: CalculoRendimientoDetalle[]
  error?: string
}

export const useRecetas = () => {
  const { fetchApi } = useApi()

  const obtenerReceta = async (productoId: string) => {
    return await fetchApi<RecetaIngrediente[]>(`/inventario/productos/${productoId}/receta`)
  }

  const guardarReceta = async (productoId: string, ingredientes: { ingrediente_id: string, cantidad_necesaria: number, id_almacen?: string }[]) => {
    return await fetchApi<RecetaIngrediente[]>(`/inventario/productos/${productoId}/receta`, {
      method: 'POST',
      body: { ingredientes }
    })
  }

  const calcularRendimiento = async (productoId: string) => {
    return await fetchApi<CalculoRendimiento>(`/inventario/productos/${productoId}/rendimiento`)
  }

  const fabricarProducto = async (productoId: string, cantidad: number, id_almacen_destino: string) => {
    return await fetchApi<{ success: boolean, message: string }>(`/inventario/productos/${productoId}/fabricar`, {
      method: 'POST',
      body: { cantidad, id_almacen_destino }
    })
  }

  return {
    obtenerReceta,
    guardarReceta,
    calcularRendimiento,
    fabricarProducto
  }
}
