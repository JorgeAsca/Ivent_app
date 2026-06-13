import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permisos/entities/permission.entity';

@Injectable()
export class RolesService implements OnModuleInit {
    private readonly logger = new Logger(RolesService.name);

    constructor(
        @InjectRepository(Role) private roleRepo: Repository<Role>,
        @InjectRepository(Permission) private permRepo: Repository<Permission>,
    ) { }

    async onModuleInit() {
        // Esperamos 2 segundos para dar tiempo a que PermisosService haga su seed
        setTimeout(() => this.seedSystemRoles(), 2000);
    }

    private async seedSystemRoles() {
        this.logger.log('Comprobando roles de sistema (Seed)...');
        const systemRoles = [
            { nombre: 'SuperAdmin', isSystem: true, empresaId: null },
            { nombre: 'Admin', isSystem: true, empresaId: null },
            { nombre: 'Empleado', isSystem: true, empresaId: null },
        ];

        for (const r of systemRoles) {
            const exists = await this.roleRepo.findOne({ where: { nombre: r.nombre, isSystem: true } });
            if (!exists) {
                const newRole = this.roleRepo.create(r);
                if (r.nombre === 'SuperAdmin') {
                    // SuperAdmin obtiene todos los permisos
                    newRole.permisos = await this.permRepo.find();
                } else if (r.nombre === 'Admin') {
                    // Admin no puede borrar empresas
                    const allPerms = await this.permRepo.find();
                    newRole.permisos = allPerms.filter(p => p.nombre !== 'empresas:eliminar');
                } else if (r.nombre === 'Empleado') {
                    const allPerms = await this.permRepo.find();
                    newRole.permisos = allPerms.filter(p => !p.nombre.includes('eliminar') && !p.nombre.includes('roles:') && !p.nombre.includes('empresas:'));
                }
                await this.roleRepo.save(newRole);
                this.logger.log(`Rol de sistema creado: ${r.nombre}`);
            }
        }
    }

    async asignarPermisoARol(id_rol: string, id_permiso: string) {
        const rol = await this.roleRepo.findOne({
            where: { id_rol },
            relations: ['permisos']
        });
        const permiso = await this.permRepo.findOne({ where: { id_permiso } });

        if (!rol || !permiso) throw new Error('Rol o Permiso no encontrado');
        if (rol.isSystem) throw new Error('No se pueden modificar los permisos de un rol del sistema');

        rol.permisos.push(permiso);
        return await this.roleRepo.save(rol);
    }

    async crear(data: { nombre: string; permisos: string[]; empresaId: string }) {
        const nuevoRol = this.roleRepo.create({ 
            nombre: data.nombre,
            empresaId: data.empresaId,
            isSystem: false
        });
        if (data.permisos && data.permisos.length > 0) {
            const permissions = await this.permRepo.createQueryBuilder('permiso')
                .where('permiso.nombre IN (:...nombres)', { nombres: data.permisos })
                .getMany();
            nuevoRol.permisos = permissions;
        }
        return await this.roleRepo.save(nuevoRol);
    }

    async actualizar(id_rol: string, data: { nombre?: string; permisos?: string[]; empresaId: string }) {
        const rol = await this.roleRepo.findOne({
            where: { id_rol },
            relations: ['permisos']
        });
        if (!rol) throw new Error('Rol no encontrado');
        if (rol.isSystem) throw new Error('No se pueden modificar los roles del sistema');
        if (rol.empresaId !== data.empresaId && rol.empresaId !== null) throw new Error('Acceso denegado');

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

    async eliminar(id_rol: string, empresaId: string) {
        const rol = await this.roleRepo.findOne({ where: { id_rol } });
        if (!rol) throw new Error('Rol no encontrado');
        if (rol.isSystem) throw new Error('No se pueden eliminar los roles del sistema');
        if (rol.empresaId !== empresaId) throw new Error('Acceso denegado');
        
        await this.roleRepo.remove(rol);
        return { success: true, id_rol };
    }

    async eliminarPorEmpresa(empresaId: string) {
        // Borrado silencioso de roles personalizados
        await this.roleRepo.delete({ empresaId });
    }

    async listar(empresaId: string) {
        return await this.roleRepo.find({ 
            where: [
                { isSystem: true },
                { empresaId: empresaId }
            ],
            relations: ['permisos'] 
        });
    }

    async findSystemRoleByName(nombre: string) {
        return await this.roleRepo.findOne({ where: { nombre, isSystem: true } });
    }
}