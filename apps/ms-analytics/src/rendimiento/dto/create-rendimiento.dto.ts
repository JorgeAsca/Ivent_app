import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateRendimientoDto {
    @IsString()
    servicio_origen: string;

    @IsString()
    operacion: string;

    @IsNumber()
    latencia_ms: number;

    @IsOptional()
    @IsUUID()
    id_usuario?: string;
}