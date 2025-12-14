import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('float', { default: 0 })
    precio: number;

    @Column('int', { default: 0 })
    stock: number;

    @Column('text', { unique: true })
    sku: string; 

    @Column('boolean', { default: true })
    activo: boolean;

    
    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { eager: true }) 
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}