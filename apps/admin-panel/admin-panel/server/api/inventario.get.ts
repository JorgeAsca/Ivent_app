// server/api/inventario.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Usamos la IP de la VPS directamente para evitar bucles de proxy en el servidor
    const data = await $fetch('http://38.242.141.205:3000/api/inventario/productos');
    return data;
  } catch (error) {
    return { error: 'No se pudieron cargar los productos' };
  }
});
