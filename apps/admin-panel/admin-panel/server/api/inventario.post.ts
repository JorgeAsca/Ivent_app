export default eventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    return await $fetch(`${config.public.apiBase}/inventario/productos`, {
      method: 'POST',
      body
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Error al crear el producto'
    })
  }
})
