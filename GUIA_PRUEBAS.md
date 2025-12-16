Crear una Empresa (Microservicio Administración)
Método: POST

URL: http://38.242.141.205:3000/administracion/empresas

Body (JSON):

JSON

{
  "nombre": "Tech Solutions S.A.",
  "nit": "900123456-1",
  "direccion": "Calle Falsa 123",
  "telefono": "555-0199",
  "email": "contacto@techsolutions.com"
}

Crear una Categoría (Microservicio Inventario)
Método: POST

URL: http://38.242.141.205:3000/inventario/categorias

Body (JSON):

JSON

{
  "nombre": "Laptops",
  "descripcion": "Computadores portátiles de alto rendimiento"
}
Copia el id que te devuelve esta petición

Crear un Producto (Microservicio Inventario)

Método: POST

URL: http://38.242.141.205:3000/inventario/productos

Body (JSON):

JSON

{
  "nombre": "MacBook Pro M3",
  "precio": 2500,
  "stock": 50,
  "sku": "APP-MAC-001",
  "categoriaId": "Pegar el ID de la categoria"
}


Consultas de Verificación
Puedes verificar que los datos persisten correctamente listando la información.

Listar todas las Categorías:

Método: GET

URL: http://38.242.141.205:3000/inventario/categorias

Listar todos los Productos:

Método: GET

URL: http://38.242.141.205:3000/inventario/productos

Buscar un Producto Específico:

Método: GET

URL: http://38.242.141.205:3000/inventario/productos/ID del producto