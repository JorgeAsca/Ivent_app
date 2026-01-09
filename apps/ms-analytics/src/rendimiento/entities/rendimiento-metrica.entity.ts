import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('rendimiento_metricas')
export class RendimientoMetrica {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    servicio_origen: string; // ej: 'ms-inventario'

    @Column()
    operacion: string; // ej: 'crear_producto'

    @Column({ type: 'int' })
    latencia_ms: number;

    @Column({ type: 'uuid', nullable: true })
    id_usuario: string;

    @CreateDateColumn()
    fecha: Date;
}