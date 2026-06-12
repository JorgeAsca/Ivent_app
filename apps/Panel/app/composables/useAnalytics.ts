import { useApi } from './useApi'

export interface DashboardStats {
  totalProductos: number;
  valorTotal: number;
  lowStockCount: number;
  lowStockProducts: any[];
  valorPorCategoria: { name: string; value: number; percentage: number }[];
  movimientosHoy: number;
  ultimosMovimientos: any[];
}

export const useAnalytics = () => {
  const { fetchApi } = useApi()

  const getDashboardStats = async () => {
    return await fetchApi<DashboardStats>('/analytics/dashboard')
  }

  return {
    getDashboardStats
  }
}
