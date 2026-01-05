import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Permission } from '../../permisos/entities/permission.entity';
import { User } from '../../usuarios/entities/user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id_rol: string;

    @Column()
    nombre: string;

    @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true })
    @JoinTable({ name: 'roles_permisos' })
    permisos: Permission[];

    @OneToMany(() => User, (user) => user.rol)
    usuarios: User[];
}