import { IsString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateRendimientoDto {
    @IsString()
    servicio_origen: string;

    @IsString()
    operacion: string;

    @IsInt()
    latencia_ms: number;

    @IsOptional()
    @IsUUID()
    id_usuario?: string;
}