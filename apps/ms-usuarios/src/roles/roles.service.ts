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

    async crear(data: { nombre: string; permisos: string[] }) {
        const nuevoRol = this.roleRepo.create({ nombre: data.nombre });
        if (data.permisos && data.permisos.length > 0) {
            const permissions = await this.permRepo.createQueryBuilder('permiso')
                .where('permiso.nombre IN (:...nombres)', { nombres: data.permisos })
                .getMany();
            nuevoRol.permisos = permissions;
        }
        return await this.roleRepo.save(nuevoRol);
    }

    async actualizar(id_rol: string, data: { nombre?: string; permisos?: string[] }) {
        const rol = await this.roleRepo.findOne({
            where: { id_rol },
            relations: ['permisos']
        });
        if (!rol) throw new Error('Rol no encontrado');

        if (data.nombre) {
            rol.nombre = data.nombre;
        }

        if (data.permisos) {
            const permissions = await this.permRepo.createQueryBuilder('permiso')
                .where('permiso.nombre IN (:...nombres)', { nombres: data.permisos })
                .getMany();
            rol.permisos = permissions;
        }

        return await this.roleRepo.save(rol);
    }

    async eliminar(id_rol: string) {
        const rol = await this.roleRepo.findOne({ where: { id_rol } });
        if (!rol) throw new Error('Rol no encontrado');
        await this.roleRepo.remove(rol);
        return { success: true, id_rol };
    }

    async listar() {
        return await this.roleRepo.find({ relations: ['permisos'] });
    }
}