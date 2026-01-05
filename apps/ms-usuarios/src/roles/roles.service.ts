import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permisos/entities/permission.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private roleRepo: Repository<Role>,
        @InjectRepository(Permission) private permRepo: Repository<Permission>,
    ) { }

    async asignarPermisoARol(id_rol: string, id_permiso: string) {
        // Cargamos el rol con sus permisos actuales
        const rol = await this.roleRepo.findOne({
            where: { id_rol },
            relations: ['permisos']
        });
        const permiso = await this.permRepo.findOne({ where: { id_permiso } });

        if (!rol || !permiso) throw new Error('Rol o Permiso no encontrado');

        // Añadimos el nuevo permiso a la lista
        rol.permisos.push(permiso);
        return await this.roleRepo.save(rol);
    }

    async crear(data: any) {
        const nuevoRol = this.roleRepo.create(data);
        return await this.roleRepo.save(nuevoRol);
    }

    async listar() {
        return await this.roleRepo.find({ relations: ['permisos'] });
    }
}