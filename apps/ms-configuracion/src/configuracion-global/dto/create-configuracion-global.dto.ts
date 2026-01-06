import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateConfiguracionGlobalDto {
    @IsString()
    clave: string;

    @IsString()
    valor: string;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}