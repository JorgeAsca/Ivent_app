export const useInventario = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase

    const getCategorias = () => useFetch('/api/inventario/categorias', { baseURL: apiBase })
    const getProductos = () => useFetch('/api/inventario/productos', { baseURL: apiBase })

    const createCategoria = (body: any) => $fetch('/api/inventario/categorias', { method: 'POST', baseURL: apiBase, body })
    const createProducto = (body: any) => $fetch('/api/inventario/productos', { method: 'POST', baseURL: apiBase, body })

    // NUEVAS FUNCIONES CRUD
    const updateProducto = (id: string, body: any) => $fetch(`/api/inventario/productos/${id}`, { method: 'PATCH', baseURL: apiBase, body })
    const deleteProducto = (id: string) => $fetch(`/api/inventario/productos/${id}`, { method: 'DELETE', baseURL: apiBase })

    return {
        getCategorias,
        getProductos,
        createCategoria,
        createProducto,
        updateProducto,
        deleteProducto
    }
}