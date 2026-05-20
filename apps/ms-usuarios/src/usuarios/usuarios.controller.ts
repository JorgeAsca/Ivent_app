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

    @MessagePattern({ cmd: 'listar_usuarios' })
    async findAll() {
        return await this.usuariosService.findAll();
    }

    @MessagePattern({ cmd: 'buscar_usuario' })
    async findOne(@Payload() id: string) {
        return await this.usuariosService.findOne(id);
    }

    @MessagePattern({ cmd: 'actualizar_usuario' })
    async update(@Payload() data: any) {
        return await this.usuariosService.update(data.id, data);
    }

    @MessagePattern({ cmd: 'eliminar_usuario' })
    async remove(@Payload() id: string) {
        return await this.usuariosService.remove(id);
    }
}