import { Controller, Post, Body, Inject, Get, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ventas')
export class MsVentasController {
  constructor(
    
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Post()
  createVenta(@Body() createVentaDto: any) {
    console.log('Recibiendo petición HTTP en Gateway para crear venta...');
    return this.natsClient.send({ cmd: 'create_venta' }, createVentaDto);
  }

  // Rutas para Proveedores
  @Post('proveedores')
  createProveedor(@Body() createProveedorDto: any) {
    return this.natsClient.send({ cmd: 'create_proveedor' }, createProveedorDto);
  }

  @Get('proveedores/:id_empresa')
  findAllProveedores(@Param('id_empresa') id_empresa: string) {
    return this.natsClient.send({ cmd: 'find_all_proveedores' }, id_empresa);
  }

  @Patch('proveedores/:id')
  updateProveedor(@Param('id') id: string, @Body() updateProveedorDto: any) {
    return this.natsClient.send({ cmd: 'update_proveedor' }, { id, data: updateProveedorDto });
  }

  @Delete('proveedores/:id')
  removeProveedor(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'remove_proveedor' }, id);
  }
}