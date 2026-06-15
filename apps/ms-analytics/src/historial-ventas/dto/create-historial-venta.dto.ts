import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateHistorialVentaDto {
    @IsUUID()
    id_venta: string;

    @IsUUID()
    id_producto: string;

    @IsUUID()
    id_empresa: string;

    @IsNumber()
    cantidad: number;

    @IsNumber()
    precio_total: number;
}