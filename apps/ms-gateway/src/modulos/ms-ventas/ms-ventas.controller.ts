import { Controller, Post, Body, Inject, Get, Param, Patch, Delete, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ventas')
export class MsVentasController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Post()
  createVenta(@Body() createVentaDto: any, @Req() req: any) {
    console.log('Recibiendo petición HTTP en Gateway para crear venta...');
    return this.natsClient.send({ cmd: 'create_venta' }, { ...createVentaDto, id_empresa: req.user.empresaId });
  }

  // Rutas para Proveedores
  @Post('proveedores')
  createProveedor(@Body() createProveedorDto: any, @Req() req: any) {
    return this.natsClient.send({ cmd: 'create_proveedor' }, { ...createProveedorDto, id_empresa: req.user.empresaId });
  }

  @Get('proveedores')
  findAllProveedores(@Req() req: any) {
    return this.natsClient.send({ cmd: 'find_all_proveedores' }, { id_empresa: req.user.empresaId });
  }

  @Patch('proveedores/:id')
  updateProveedor(@Param('id') id: string, @Body() updateProveedorDto: any, @Req() req: any) {
    return this.natsClient.send({ cmd: 'update_proveedor' }, { id, data: updateProveedorDto, id_empresa: req.user.empresaId });
  }

  @Delete('proveedores/:id')
  removeProveedor(@Param('id') id: string, @Req() req: any) {
    return this.natsClient.send({ cmd: 'remove_proveedor' }, { id, id_empresa: req.user.empresaId });
  }
}