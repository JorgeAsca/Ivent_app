import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_documento')
export class TipoDocumento {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 10, unique: true })
    codigo: string; 
}