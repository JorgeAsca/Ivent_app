import { IsUUID, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateProveedorDto {
    @IsUUID()
    @IsNotEmpty()
    id_empresa: string; // ID de la empresa dueña del registro (ms-administracion)

    @IsString()
    @IsNotEmpty()
    razon_social: string;

    @IsString()
    @IsNotEmpty()
    identificacion_fiscal: string; // RUC, NIT, CIF, etc.

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}