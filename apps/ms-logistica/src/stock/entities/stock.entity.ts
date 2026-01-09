import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('stock_consolidado')
export class Stock {
    @PrimaryColumn('uuid')
    id_producto: string;

    @PrimaryColumn('uuid')
    id_almacen: string;

    @Column({ type: 'int', default: 0 })
    cantidad: number;
}