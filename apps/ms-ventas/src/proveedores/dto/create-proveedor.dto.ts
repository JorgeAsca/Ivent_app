import { IsUUID, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateProveedorDto {
    @IsUUID()
    @IsNotEmpty()
    id_empresa: string; // ID de la empresa dueña del registro (ms-administracion)

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    razon_social: string;

    @IsOptional()
    @IsString()
    contacto_nombre?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsString()
    identificacion_fiscal?: string;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}