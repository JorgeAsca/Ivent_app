import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateAlmacenDto {
    @IsUUID()
    id_empresa: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
}