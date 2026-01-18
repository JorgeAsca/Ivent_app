<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Producto } from '~/types' // Importa tu interfaz

// Añade el tipo Producto a la definición de columnas
const columns: TableColumn<Producto>[] = [
  {
    accessorKey: 'nombre',
    header: 'Producto'
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    // Ahora 'row' ya sabe que contiene un Producto
    cell: ({ row }) => {
      const valor = row.original.precio
      // Usamos una validación simple por si el dato llega nulo de la DB
      return typeof valor === 'number'
        ? `$${valor.toFixed(2)}`
        : '$0.00'
    }
  },
  {
    accessorKey: 'stock',
    header: 'Stock'
  }
]
</script>
