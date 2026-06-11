import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; // Propietaria de este registro (ms-administracion)

    @Column({ unique: true })
    codigo: string;

    @Column()
    razon_social: string;

    @Column({ nullable: true })
    contacto_nombre: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    telefono: string;

    @Column('text', { nullable: true })
    direccion: string;

    @Column({ unique: true, nullable: true })
    identificacion_fiscal: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;
}