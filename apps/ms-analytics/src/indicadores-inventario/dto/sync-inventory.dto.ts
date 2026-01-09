import { IsUUID, IsInt, IsNotEmpty } from 'class-validator';

export class SyncInventoryDto {
    @IsUUID()
    id_producto: string;

    @IsUUID()
    id_empresa: string;

    @IsInt()
    stock_actual: number;
}