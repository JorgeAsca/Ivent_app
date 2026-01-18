export default eventHandler(async (event) => {
  const config = useRuntimeConfig();
  const method = getMethod(event);

  try {
    return await $fetch(`${config.public.apiBase}/inventario/productos`, {
      method,
      body: method !== 'GET' ? await readBody(event) : undefined
    });
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode, statusMessage: 'Error de Microservicio' });
  }
});
