import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { 
  CreateEmpresaDto, 
  ADMIN_PATTERNS 
} from '@app/common'; // Asegúrate de que esta importación sea correcta según tu monorepo

@Controller('administracion') 
export class AdministracionController {
  constructor(
    @Inject('ADMINISTRACION_SERVICE') private readonly adminClient: ClientProxy,
  ) {}

  @Post('empresas')
  createEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    // Usamos el patrón exacto que ya tenías
    return this.adminClient.send(ADMIN_PATTERNS.CREAR_EMPRESA, createEmpresaDto);
  }
}