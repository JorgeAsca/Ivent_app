// apps/admin-panel/app/types/index.ts
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoriaId: string;
  categoria?: Categoria;
}
