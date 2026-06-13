import { Body, Controller, Inject, Post, Get, Param, Patch, Delete, Req, ForbiddenException } from '@nestjs/common';
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
  listarEmpresas(@Req() req: any) {
    const empresaId = req.user?.empresaId;
    return this.natsClient.send({ cmd: 'listar_empresas' }, { empresaId });
  }

  @Patch('empresas/:id')
  actualizarEmpresa(@Param('id') id: string, @Body() data: any) {
    return this.natsClient.send({ cmd: 'actualizar_empresa' }, { id, ...data });
  }

  @Delete('empresas/:id')
  eliminarEmpresa(@Param('id') id: string, @Req() req: any) {
    const rolNombre = req.user?.rolNombre?.toLowerCase();
    if (rolNombre !== 'superadmin' && rolNombre !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar la empresa');
    }
    return this.natsClient.send({ cmd: 'eliminar_empresa' }, id);
  }
}