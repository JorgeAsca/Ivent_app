import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('recetas_ingredientes')
export class RecetaIngrediente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    producto_id: string;

    @Column('uuid')
    ingrediente_id: string;

    @Column('float')
    cantidad_necesaria: number;

    @Column('uuid')
    id_empresa: string;

    @Column('uuid', { nullable: true })
    id_almacen: string;

    @ManyToOne(() => Producto, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    producto_final: Producto;

    @ManyToOne(() => Producto, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingrediente_id' })
    ingrediente: Producto;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
