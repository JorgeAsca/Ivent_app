import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('direcciones')
export class Direccion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    calle: string;

    @Column()
    ciudad: string;

    @Column()
    estado_provincia: string;

    @Column()
    codigo_postal: string;

    @Column()
    pais: string;

    @Column({ type: 'uuid' })
    entidad_id: string; // ID del Cliente o Proveedor al que pertenece

    @Column()
    tipo_entidad: string; // 'CLIENTE' o 'PROVEEDOR'
}