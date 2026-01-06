import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; // ms-administracion

    @Column()
    razon_social: string;

    @Column({ unique: true })
    identificacion_fiscal: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;
}