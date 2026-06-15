import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
        private readonly rolesService: RolesService,
    ) { }

    async findByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email }, relations: ['rol', 'rol.permisos'] });
    }

    async crearUsuario(data: any, isInternalRegistration = false) {
        // Comunicación: Preguntar al ms-administracion usando el payload correcto { id_empresa }
        const empresa = await firstValueFrom(
            this.natsClient.send({ cmd: 'validar_empresa' }, { id_empresa: data.empresaId })
        );

        if (!empresa) {
            throw new Error('La empresa referenciada no existe en el sistema');
        }

        const { rolId, password, ...rest } = data;
        const nuevoUsuario = this.userRepo.create(rest as Partial<User>);

        if (password) {
            const salt = await bcrypt.genSalt(10);
            nuevoUsuario.password = await bcrypt.hash(password, salt);
        }

        if (rolId) {
            const roleToAssign = await this.rolesService.findSystemRoleByName('SuperAdmin');
            if (roleToAssign && roleToAssign.id_rol === rolId && !isInternalRegistration) {
                throw new Error('El rol de SuperAdmin está reservado para el creador del sistema y no puede ser asignado manualmente.');
            }
            nuevoUsuario.rol = { id_rol: rolId } as Role;
        }

        return await this.userRepo.save(nuevoUsuario);
    }

    async findAll(empresaId?: string) {
        const whereClause = empresaId ? { empresaId } : {};
        return await this.userRepo.find({ where: whereClause, relations: ['rol', 'rol.permisos'] });
    }

    async findOne(id: string) {
        const usuario = await this.userRepo.findOne({ where: { id_usuario: id }, relations: ['rol', 'rol.permisos'] });
        if (!usuario) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }

    async findByIds(ids: string[]) {
        if (!ids || ids.length === 0) return [];
        return await this.userRepo.find({
            where: { id_usuario: In(ids) }
        });
    }

    async update(id: string, updateData: any) {
        const usuario = await this.findOne(id);
        const { rolId, password, ...rest } = updateData;
        
        if (usuario.rol?.nombre === 'SuperAdmin' && rolId !== undefined && rolId !== usuario.rol.id_rol) {
            throw new Error('No se le puede quitar el rol de SuperAdmin al dueño de la empresa.');
        }

        const actualizado = Object.assign(usuario, rest);
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            actualizado.password = await bcrypt.hash(password, salt);
        }

        if (rolId !== undefined && rolId !== usuario.rol?.id_rol) {
            const roleToAssign = await this.rolesService.findSystemRoleByName('SuperAdmin');
            if (roleToAssign && roleToAssign.id_rol === rolId) {
                throw new Error('El rol de SuperAdmin está reservado y no puede ser asignado manualmente a otro usuario.');
            }
            actualizado.rol = rolId ? ({ id_rol: rolId } as Role) : null;
        }
        
        return await this.userRepo.save(actualizado);
    }

    async remove(id: string) {
        const usuario = await this.findOne(id);
        if (usuario.rol?.nombre === 'SuperAdmin') {
            throw new Error('El usuario principal de la empresa (SuperAdmin) no puede ser eliminado. Para borrarlo, debes eliminar la empresa entera.');
        }
        return await this.userRepo.remove(usuario);
    }

    async eliminarPorEmpresa(empresaId: string) {
        // Borrado silencioso y nuclear sin restricciones
        await this.userRepo.delete({ empresaId });
    }
}