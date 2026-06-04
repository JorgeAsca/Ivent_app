import { Body, Controller, Inject, Post, Get, Param, Patch, Delete } from '@nestjs/common';
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

  @Get('empresas')
  listarEmpresas() {
    return this.natsClient.send({ cmd: 'listar_empresas' }, {});
  }

  @Patch('empresas/:id')
  actualizarEmpresa(@Param('id') id: string, @Body() data: any) {
    return this.natsClient.send({ cmd: 'actualizar_empresa' }, { id, ...data });
  }

  @Delete('empresas/:id')
  eliminarEmpresa(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'eliminar_empresa' }, id);
  }
}