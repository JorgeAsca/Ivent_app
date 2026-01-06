import { IsUUID, IsString, IsEnum } from 'class-validator';

export class CreateDireccionDto {
    @IsUUID()
    entidad_id: string;

    @IsEnum(['CLIENTE', 'PROVEEDOR'])
    tipo_entidad: string;

    @IsString()
    calle: string;

    @IsString()
    ciudad: string;

    @IsString()
    pais: string;
}