import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reglas_pedido_automatico')
export class ReglaPedido {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string;

    @Column({ type: 'uuid' })
    id_producto: string; // ms-inventario

    @Column({ type: 'uuid' })
    id_proveedor: string; // Referencia interna a tabla proveedores

    @Column({ type: 'int' })
    stock_minimo: number;

    @Column({ type: 'int' })
    cantidad_a_pedir: number;

    @Column({ default: true })
    activo: boolean;
}