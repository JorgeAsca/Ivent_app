import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('movimientos_inventario')
export class Movimiento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_producto: string; // Referencia ms-inventario

    @Column({ type: 'uuid' })
    id_almacen: string;

    @Column({ type: 'enum', enum: ['ENTRADA', 'SALIDA'] })
    tipo: string;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ nullable: true })
    referencia_externa: string; // ID de la orden de ms-terceros o ms-ventas

    @Column({ nullable: true })
    ticket_id: string; // Agrupador de ventas del POS

    @Column({ nullable: true })
    motivo: string; // Ej: SALIDA (VENTA)

    @Column({ type: 'uuid', nullable: true })
    id_usuario: string; // Usuario que realizó el movimiento

    @Column({ type: 'uuid' })
    id_empresa: string;

    @CreateDateColumn()
    fecha_movimiento: Date;
}