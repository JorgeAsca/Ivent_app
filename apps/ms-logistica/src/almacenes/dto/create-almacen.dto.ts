import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAlmacenDto {
    @IsUUID()
    id_empresa: string;

    @IsOptional()
    @IsString()
    codigo?: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsOptional()
    @IsString()
    estado?: string;
}