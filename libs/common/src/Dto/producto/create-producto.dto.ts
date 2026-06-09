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

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    public stock: number;

    @IsString()
    @IsNotEmpty()
    public sku: string;

    @IsUUID()
    @IsNotEmpty()
    public categoriaId: string;

    @IsOptional()
    @IsUUID()
    public almacenId?: string;

    @IsOptional()
    @IsString()
    public unidadMedida?: string;
}