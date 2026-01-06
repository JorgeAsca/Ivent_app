import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('configuracion_global')
export class ConfiguracionGlobal {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    clave: string; 

    @Column({ type: 'text' })
    valor: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;
}