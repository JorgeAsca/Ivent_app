import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermisosService {
    constructor(
        @InjectRepository(Permission)
        private readonly permisoRepo: Repository<Permission>,
    ) { }

    async crear(data: { nombre: string }) {
        const nuevoPermiso = this.permisoRepo.create(data);
        return await this.permisoRepo.save(nuevoPermiso);
    }

    async listar() {
        return await this.permisoRepo.find();
    }

    async obtenerUno(id_permiso: string) {
        return await this.permisoRepo.findOne({ where: { id_permiso } });
    }
}