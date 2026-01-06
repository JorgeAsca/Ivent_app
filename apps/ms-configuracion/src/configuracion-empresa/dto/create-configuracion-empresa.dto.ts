import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateConfiguracionEmpresaDto {
    @IsUUID()
    id_empresa: string;

    @IsString()
    @IsOptional()
    moneda?: string;

    @IsString()
    @IsOptional()
    timezone?: string;

    @IsObject()
    @IsOptional()
    ajustes_visuales?: any;
}