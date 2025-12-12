import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ADMIN_PATTERNS, CreateRolDto, AsignarPermisoRolDto } from '@app/common';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern(ADMIN_PATTERNS.CREAR_ROL)
  async createRol(@Payload() data: CreateRolDto) {
    return this.rolesService.createRol(data);
  }

  @MessagePattern(ADMIN_PATTERNS.ASIGNAR_PERMISO_ROL)
  async asignarPermiso(@Payload() data: AsignarPermisoRolDto) {
    return this.rolesService.asignarPermiso(data);
  }
}