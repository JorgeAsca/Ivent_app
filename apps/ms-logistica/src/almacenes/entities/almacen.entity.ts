import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('almacenes')
export class Almacen {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; 

    @Column({ nullable: true })
    codigo: string;

    @Column()
    nombre: string;

    @Column({ default: 'activo' })
    estado: string;

    @CreateDateColumn()
    createdAt: Date;
}