import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('historial_ventas')
export class HistorialVenta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_venta: string; // ID original en ms-ventas

    @Column({ type: 'uuid' })
    id_producto: string;

    @Column({ type: 'uuid' })
    id_empresa: string;

    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_total: number;

    @CreateDateColumn()
    fecha_registro: Date;
}