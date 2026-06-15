import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('indicadores_inventario')
export class IndicadorInventario {
    @PrimaryColumn('uuid')
    id_producto: string;

    @Column({ type: 'float', default: 0 })
    stock_actual: number;

    @Column({ type: 'float', default: 0 })
    stock_reservado: number; 

    @Column({ type: 'uuid' })
    id_empresa: string;

    @UpdateDateColumn()
    ultima_actualizacion: Date;
}