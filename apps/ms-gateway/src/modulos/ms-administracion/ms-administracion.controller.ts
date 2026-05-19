import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ADMIN_PATTERNS } from '@app/common';

@Controller('administracion') 
export class AdministracionController {
  constructor(
    // CAMBIA ESTO: De 'ADMINISTRACION_SERVICE' a 'NATS_SERVICE'
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Post('empresas')
  createEmpresa(@Body() createEmpresaDto: any) {
    // Usa natsClient en lugar de adminClient
    return this.natsClient.send(ADMIN_PATTERNS.CREAR_EMPRESA, createEmpresaDto);
  }
}