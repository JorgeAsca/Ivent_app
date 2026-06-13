import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from './usuarios.service';
import { RolesService } from '../roles/roles.service';

@Controller()
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly rolesService: RolesService,
    ) { }
    @MessagePattern({ cmd: 'crear_usuario' })
    async create(@Payload() data: any) {
        return await this.usuariosService.crearUsuario(data);
    }

    @MessagePattern({ cmd: 'listar_usuarios' })
    async findAll(@Payload() data: { empresaId: string }) {
        return await this.usuariosService.findAll(data?.empresaId);
    }

    @MessagePattern({ cmd: 'buscar_usuario' })
    async findOne(@Payload() id: string) {
        return await this.usuariosService.findOne(id);
    }

    @MessagePattern({ cmd: 'get_usuarios_by_ids' })
    async findByIds(@Payload() ids: string[]) {
        return await this.usuariosService.findByIds(ids);
    }

    @MessagePattern({ cmd: 'actualizar_usuario' })
    async update(@Payload() data: any) {
        return await this.usuariosService.update(data.id, data);
    }

    @MessagePattern({ cmd: 'eliminar_usuario' })
    async remove(@Payload() id: string) {
        return await this.usuariosService.remove(id);
    }

    @EventPattern('eliminar_datos_empresa')
    async eliminarDatosEmpresa(@Payload() data: { empresaId: string }) {
        if (!data.empresaId) return;
        // Primero eliminar usuarios, luego roles (por temas de FK) o viceversa
        await this.usuariosService.eliminarPorEmpresa(data.empresaId);
        await this.rolesService.eliminarPorEmpresa(data.empresaId);
    }
}