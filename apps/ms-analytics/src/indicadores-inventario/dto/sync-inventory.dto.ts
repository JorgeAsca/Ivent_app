import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class SyncInventoryDto {
    @IsUUID()
    id_producto: string;

    @IsUUID()
    id_empresa: string;

    @IsNumber()
    stock_actual: number;
}