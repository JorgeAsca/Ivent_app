import { IsUUID, IsNumber, IsArray, ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredienteDto {
    @IsUUID()
    ingrediente_id: string;

    @IsNumber()
    cantidad_necesaria: number;

    @IsUUID()
    @IsOptional()
    id_almacen?: string;
}

export class CreateRecetaDto {
    @IsUUID()
    producto_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredienteDto)
    ingredientes: IngredienteDto[];

    @IsUUID()
    @IsNotEmpty()
    id_empresa: string;
}
