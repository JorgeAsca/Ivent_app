import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('permisos')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id_permiso: string;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    descripcion: string;

    @ManyToMany(() => Role, (role) => role.permisos)
    roles: Role[];
}