import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ADMIN_PATTERNS, CreateUsuarioDto } from '@app/common';
import { UsuariosService } from './usuarios.service';

@Controller()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @MessagePattern(ADMIN_PATTERNS.CREAR_USUARIO)
  async createUsuario(@Payload() data: CreateUsuarioDto) {
    return this.usuariosService.createUsuario(data);
  }
}