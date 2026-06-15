import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

const DEFAULT_PERMISSIONS = [
    { nombre: 'usuarios:leer', descripcion: 'Ver lista de usuarios' },
    { nombre: 'usuarios:crear', descripcion: 'Crear nuevos usuarios' },
    { nombre: 'usuarios:editar', descripcion: 'Editar usuarios existentes' },
    { nombre: 'usuarios:eliminar', descripcion: 'Eliminar usuarios' },
    { nombre: 'roles:leer', descripcion: 'Ver lista de roles y permisos' },
    { nombre: 'roles:crear', descripcion: 'Crear nuevos roles' },
    { nombre: 'roles:editar', descripcion: 'Editar roles existentes' },
    { nombre: 'roles:eliminar', descripcion: 'Eliminar roles' },
    { nombre: 'empresas:leer', descripcion: 'Ver lista de empresas' },
    { nombre: 'empresas:crear', descripcion: 'Crear nuevas empresas' },
    { nombre: 'empresas:editar', descripcion: 'Editar empresas' },
    { nombre: 'empresas:eliminar', descripcion: 'Eliminar empresas' },
    { nombre: 'productos:leer', descripcion: 'Ver lista de productos' },
    { nombre: 'productos:crear', descripcion: 'Crear productos' },
    { nombre: 'productos:editar', descripcion: 'Editar productos' },
    { nombre: 'productos:eliminar', descripcion: 'Eliminar productos' },
    { nombre: 'almacenes:leer', descripcion: 'Ver lista de almacenes' },
    { nombre: 'almacenes:crear', descripcion: 'Crear nuevos almacenes' },
    { nombre: 'almacenes:editar', descripcion: 'Editar almacenes' },
    { nombre: 'almacenes:eliminar', descripcion: 'Eliminar almacenes' },
    { nombre: 'categorias:leer', descripcion: 'Ver categorías' },
    { nombre: 'categorias:crear', descripcion: 'Crear categorías' },
    { nombre: 'categorias:editar', descripcion: 'Editar categorías' },
    { nombre: 'categorias:eliminar', descripcion: 'Eliminar categorías' },
    { nombre: 'proveedores:leer', descripcion: 'Ver proveedores' },
    { nombre: 'proveedores:crear', descripcion: 'Crear proveedores' },
    { nombre: 'proveedores:editar', descripcion: 'Editar proveedores' },
    { nombre: 'proveedores:eliminar', descripcion: 'Eliminar proveedores' },
    { nombre: 'movimientos:leer', descripcion: 'Ver historial de movimientos' },
    { nombre: 'movimientos:crear', descripcion: 'Crear movimientos manuales' },
    { nombre: 'reportes:leer', descripcion: 'Ver reportes y analíticas' },
];

@Injectable()
export class PermisosService implements OnModuleInit {
    private readonly logger = new Logger(PermisosService.name);

    constructor(
        @InjectRepository(Permission)
        private readonly permisoRepo: Repository<Permission>,
    ) { }

    async onModuleInit() {
        await this.seedPermissions();
    }

    public async seedPermissions() {
        this.logger.log('Comprobando permisos base (Seed)...');
        for (const perm of DEFAULT_PERMISSIONS) {
            const exists = await this.permisoRepo.findOne({ where: { nombre: perm.nombre } });
            if (!exists) {
                const nuevo = this.permisoRepo.create(perm);
                await this.permisoRepo.save(nuevo);
                this.logger.log(`Permiso creado: ${perm.nombre}`);
            }
        }
    }

    async crear(data: { nombre: string; descripcion?: string }) {
        const nuevoPermiso = this.permisoRepo.create(data);
        return await this.permisoRepo.save(nuevoPermiso);
    }

    async listar() {
        const permisos = await this.permisoRepo.find();
        return permisos.filter(p => p.nombre !== 'empresas:eliminar');
    }

    async obtenerUno(id_permiso: string) {
        return await this.permisoRepo.findOne({ where: { id_permiso } });
    }
}