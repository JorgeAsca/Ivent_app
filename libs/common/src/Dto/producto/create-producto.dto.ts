import { IsString, IsNumber, IsNotEmpty, IsPositive, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    public nombre: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number) // Asegura que se transforme a número si viene como string
    public precio: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    public stock: number;

    @IsString()
    @IsNotEmpty()
    public sku: string;

    @IsUUID()
    @IsNotEmpty()
    public categoriaId: string; // Relación con categoría
}