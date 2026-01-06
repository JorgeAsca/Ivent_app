import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateClienteDto {
    @IsUUID()
    id_empresa: string;

    @IsString()
    @IsNotEmpty()
    razon_social: string;

    @IsString()
    @IsNotEmpty()
    identificacion_fiscal: string;
}