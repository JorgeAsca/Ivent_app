import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermisosService } from './permisos.service';

@Controller()
export class PermisosController {
    constructor(private readonly permisosService: PermisosService) { }

    @MessagePattern({ cmd: 'crear_permiso' })
    crear(@Payload() data: { nombre: string }) {
        return this.permisosService.crear(data);
    }

    @MessagePattern({ cmd: 'listar_permisos' })
    listar() {
        return this.permisosService.listar();
    }
}