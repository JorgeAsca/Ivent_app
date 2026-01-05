import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from './usuarios.service';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @MessagePattern({ cmd: 'crear_usuario' })
    async create(@Payload() data: any) {
        return await this.usuariosService.crearUsuario(data);
    }
}