export class CreateProductoDto {
    public nombre: string;
    public precio: number;
    public stock: number;
    public sku: string;
    public categoriaId: string;
    public almacenId?: string;
    public unidadMedida?: string;
    public stockMinimo?: number;
    public proveedorId?: string;
}