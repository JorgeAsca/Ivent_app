import { IsString, IsNumber, IsNotEmpty, IsPositive, Min, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    public nombre: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number) 
    public precio: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    public costo?: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    public stock: number;

    @IsOptional()
    @IsString()
    public sku?: string;

    @IsUUID()
    @IsNotEmpty()
    public categoriaId: string;

    @IsOptional()
    @IsUUID()
    public almacenId?: string;

    @IsOptional()
    @IsString()
    public unidadMedida?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    public stockMinimo?: number;

    @IsOptional()
    @IsUUID()
    public proveedorId?: string;

    @IsOptional()
    @IsString()
    public tipo?: 'SIMPLE' | 'COMPUESTO';
}