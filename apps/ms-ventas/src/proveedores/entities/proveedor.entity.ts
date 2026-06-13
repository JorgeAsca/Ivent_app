import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('proveedores')
@Unique(['codigo', 'id_empresa'])
@Unique(['identificacion_fiscal', 'id_empresa'])
export class Proveedor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_empresa: string; // Propietaria de este registro (ms-administracion)

    @Column()
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

    @Column({ nullable: true })
    identificacion_fiscal: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;
}