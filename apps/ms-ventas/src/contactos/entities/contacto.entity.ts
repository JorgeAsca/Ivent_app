import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contactos')
export class Contacto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre_completo: string;

    @Column()
    puesto: string; // ej: Gerente de Ventas

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column({ type: 'uuid' })
    entidad_id: string;

    @Column()
    tipo_entidad: string; // 'CLIENTE' o 'PROVEEDOR'
}