import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('almacenes')
export class Almacen {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; //

    @Column()
    nombre: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;
}