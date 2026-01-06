import { IsUUID, IsString, IsEmail } from 'class-validator';

export class CreateContactoDto {
    @IsUUID()
    entidad_id: string;

    @IsString()
    tipo_entidad: string;

    @IsString()
    nombre_completo: string;

    @IsEmail()
    email: string;

    @IsString()
    telefono: string;
}