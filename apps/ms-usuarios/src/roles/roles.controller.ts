import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @MessagePattern({ cmd: 'crear_rol' })
    crear(@Payload() data: { nombre: string }) {
        // Nota: Aquí podrías incluir empresaId si los roles son por empresa
        return this.rolesService.crear(data);
    }

    @MessagePattern({ cmd: 'asignar_permiso_a_rol' })
    asignarPermiso(@Payload() data: { id_rol: string; id_permiso: string }) {
        return this.rolesService.asignarPermisoARol(data.id_rol, data.id_permiso);
    }

    @MessagePattern({ cmd: 'listar_roles' })
    listar() {
        return this.rolesService.listar();
    }
}