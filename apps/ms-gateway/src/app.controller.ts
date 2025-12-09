import { Controller, Get, Inject,Body, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs/internal/Observable';
import { ClientProxy } from '@nestjs/microservices';
import { 
  CreateEmpresaDto, 
  CreateUsuarioDto, 
  CreatePermisoDto, 
  ADMIN_PATTERNS 
} from '@app/common';


@Controller('admin')
export class AppController {
  constructor(
    @Inject('ADMINISTRACION_SERVICE') private readonly adminClient: ClientProxy,
  ) {}

  // --- EMPRESAS ---
  @Post('empresas')
  createEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    // Envía el mensaje al microservicio y espera la respuesta
    return this.adminClient.send(ADMIN_PATTERNS.CREAR_EMPRESA, createEmpresaDto);
  }

  // --- USUARIOS ---
  @Post('usuarios')
  createUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.adminClient.send(ADMIN_PATTERNS.CREAR_USUARIO, createUsuarioDto);
  }

  // --- PERMISOS ---
  @Post('permisos')
  createPermiso(@Body() createPermisoDto: CreatePermisoDto) {
    return this.adminClient.send(ADMIN_PATTERNS.CREAR_PERMISO, createPermisoDto);
  }

  // Health check simple
  @Get('health')
  healthCheck() {
    return 'Gateway is running';
  }
}