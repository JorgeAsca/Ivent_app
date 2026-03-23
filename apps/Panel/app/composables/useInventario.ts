export const useInventario = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase

    // Obtener datos
    const getCategorias = () => useFetch('/api/inventario/categorias', { baseURL: apiBase })
    const getProductos = () => useFetch('/api/inventario/productos', { baseURL: apiBase })

    // Crear datos (Aquí solucionamos el error de TypeScript tipando el body)
    const createCategoria = (body: Record<string, any>) => $fetch('/api/inventario/categorias', { method: 'POST', baseURL: apiBase, body })
    const createProducto = (body: Record<string, any>) => $fetch('/api/inventario/productos', { method: 'POST', baseURL: apiBase, body })

    return {
        getCategorias,
        getProductos,
        createCategoria,
        createProducto
    }
}