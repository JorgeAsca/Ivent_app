import { IsString, MinLength } from 'class-validator';

export class CreateTipoDocumentoDto {
    @IsString()
    @MinLength(1)
    nombre: string; 

    @IsString()
    @MinLength(1)
    codigo: string;
}