import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

    async findByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email }, relations: ['rol'] });
    }

    async crearUsuario(data: any) {
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
            nuevoUsuario.rol = { id_rol: rolId } as Role;
        }

        return await this.userRepo.save(nuevoUsuario);
    }

    async findAll() {
        return await this.userRepo.find({ relations: ['rol'] });
    }

    async findOne(id: string) {
        const usuario = await this.userRepo.findOne({ where: { id_usuario: id }, relations: ['rol'] });
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
        
        const actualizado = Object.assign(usuario, rest);
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            actualizado.password = await bcrypt.hash(password, salt);
        }

        if (rolId !== undefined) {
            actualizado.rol = rolId ? ({ id_rol: rolId } as Role) : null;
        }
        
        return await this.userRepo.save(actualizado);
    }

    async remove(id: string) {
        const usuario = await this.findOne(id);
        return await this.userRepo.remove(usuario);
    }
}