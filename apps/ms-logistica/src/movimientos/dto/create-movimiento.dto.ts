import { IsUUID, IsEnum, IsInt, IsString, IsOptional } from 'class-validator';

export class CreateMovimientoDto {
    @IsUUID()
    id_producto: string;

    @IsUUID()
    id_almacen: string;

    @IsUUID()
    id_empresa: string;

    @IsEnum(['ENTRADA', 'SALIDA'])
    tipo: string;

    @IsInt()
    cantidad: number;

    @IsOptional()
    @IsString()
    referencia_externa?: string;
}