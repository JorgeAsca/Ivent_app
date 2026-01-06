import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; // Propietaria de este registro (ms-administracion)

    @Column()
    razon_social: string;

    @Column({ unique: true })
    identificacion_fiscal: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;
}