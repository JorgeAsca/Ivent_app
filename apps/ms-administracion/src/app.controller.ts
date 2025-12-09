import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEmpresaDto, CreateUsuarioDto, CreatePermisoDto, ADMIN_PATTERNS } from '@app/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(ADMIN_PATTERNS.CREAR_EMPRESA)
  async createEmpresa(@Payload() data: CreateEmpresaDto) {
    return this.appService.createEmpresa(data);
  }

  @MessagePattern(ADMIN_PATTERNS.CREAR_USUARIO)
  async createUsuario(@Payload() data: CreateUsuarioDto) {
    return this.appService.createUsuario(data);
  }

  @MessagePattern(ADMIN_PATTERNS.CREAR_PERMISO)
  async createPermiso(@Payload() data: CreatePermisoDto) {
    return this.appService.createPermiso(data);
  }
}