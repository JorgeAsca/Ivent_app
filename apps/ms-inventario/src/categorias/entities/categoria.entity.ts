import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    nombre: string;

    @Column('text', { nullable: true })
    descripcion: string;

    @Column('boolean', { default: true })
    activo: boolean;

    // Relación: Una categoría tiene muchos productos
    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}