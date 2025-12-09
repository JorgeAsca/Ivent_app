import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ADMIN_PATTERNS, CreatePermisoDto } from '@app/common';
import { PermisosService } from './permisos.service';

@Controller()
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @MessagePattern(ADMIN_PATTERNS.CREAR_PERMISO)
  async createPermiso(@Payload() data: CreatePermisoDto) {
    return this.permisosService.createPermiso(data);
  }
}