import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { 
  CreateEmpresaDto, 
  ADMIN_PATTERNS 
} from '@app/common';

@Controller('administracion') 
export class AdministracionController {
  constructor(
    @Inject('ADMINISTRACION_SERVICE') private readonly adminClient: ClientProxy,
  ) {}

  @Post('empresas')
  createEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    
    return this.adminClient.send(ADMIN_PATTERNS.CREAR_EMPRESA, createEmpresaDto);
  }
}