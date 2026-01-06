import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuracion_empresa')
export class ConfiguracionEmpresa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', unique: true })
    id_empresa: string; 

    @Column({ type: 'varchar', length: 10, default: 'PEN' })
    moneda: string;

    @Column({ type: 'varchar', length: 50, default: 'America/Lima' })
    timezone: string;

    @Column({ type: 'jsonb', nullable: true })
    ajustes_visuales: any; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}