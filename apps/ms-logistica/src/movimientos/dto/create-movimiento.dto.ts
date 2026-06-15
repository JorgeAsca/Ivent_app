import { IsUUID, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMovimientoDto {
    @IsUUID()
    id_producto: string;

    @IsUUID()
    id_almacen: string;

    @IsUUID()
    id_empresa: string;

    @IsEnum(['ENTRADA', 'SALIDA'])
    tipo: string;

    @IsNumber()
    cantidad: number;

    @IsOptional()
    @IsString()
    referencia_externa?: string;

    @IsOptional()
    @IsString()
    ticket_id?: string;

    @IsOptional()
    @IsString()
    motivo?: string;

    @IsOptional()
    @IsUUID()
    id_usuario?: string;
}