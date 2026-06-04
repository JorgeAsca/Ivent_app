import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @MessagePattern({ cmd: 'crear_rol' })
    crear(@Payload() data: { nombre: string; permisos: string[] }) {
        return this.rolesService.crear(data);
    }

    @MessagePattern({ cmd: 'actualizar_rol' })
    actualizar(@Payload() data: { id: string; nombre?: string; permisos?: string[] }) {
        return this.rolesService.actualizar(data.id, data);
    }

    @MessagePattern({ cmd: 'eliminar_rol' })
    eliminar(@Payload() id: string) {
        return this.rolesService.eliminar(id);
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