import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_usuario: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    nombre: string;

    @Column()
    empresaId: string; 

    @ManyToOne(() => Role, (role) => role.usuarios)
    @JoinColumn({ name: 'id_rol' })
    rol: Role;
}