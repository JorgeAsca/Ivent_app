import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject('MS_ADMIN_SERVICE') private readonly clientAdmin: ClientProxy,
    ) { }

    async crearUsuario(data: any) {
        // Comunicación: Preguntar al ms-administracion
        const empresa = await firstValueFrom(
            this.clientAdmin.send({ cmd: 'validar_empresa' }, { id: data.empresaId })
        );

        if (!empresa) {
            throw new Error('La empresa referenciada no existe en el sistema');
        }

        const nuevoUsuario = this.userRepo.create(data);
        return await this.userRepo.save(nuevoUsuario);
    }
}