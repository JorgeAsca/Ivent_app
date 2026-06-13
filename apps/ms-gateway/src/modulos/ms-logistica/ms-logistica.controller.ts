import { Controller, Get, Param, Inject, Post, Body, Query, Req } from '@nestjs/common';
import { RequirePermissions } from '../../decorators/permissions.decorator';
import { ClientProxy } from '@nestjs/microservices';

@Controller('logistica')
export class MsLogisticaController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Get('stock/:productoId')
  obtenerStock(@Param('productoId') productoId: string, @Req() req: any) {
    console.log(`Recibiendo petición HTTP para consultar stock del producto: ${productoId}`);
    return this.natsClient.send({ cmd: 'obtener_stock' }, { productoId, id_empresa: req.user.empresaId });
  } 

  @Post('movimientos')
  @RequirePermissions('movimientos:crear')
  crearMovimiento(@Body() data: any, @Req() req: any) {
    console.log('Recibiendo petición HTTP para crear movimiento de stock:', data);
    return this.natsClient.send({ cmd: 'crear_movimiento' }, { ...data, id_empresa: req.user.empresaId });
  }

  @Get('movimientos')
  listarMovimientos(@Req() req: any) {
    return this.natsClient.send({ cmd: 'listar_movimientos' }, { id_empresa: req.user.empresaId });
  }

  @Get('almacenes')
  listarAlmacenes(@Req() req: any) {
    return this.natsClient.send({ cmd: 'find_all_almacenes' }, { id_empresa: req.user.empresaId });
  }

  @Post('almacenes')
  @RequirePermissions('almacenes:crear')
  crearAlmacen(@Body() data: any, @Req() req: any) {
    return this.natsClient.send({ cmd: 'create_almacen' }, { ...data, id_empresa: req.user.empresaId });
  }

  @Get('almacenes/:id/stock')
  obtenerStockAlmacen(@Param('id') id: string, @Req() req: any) {
    return this.natsClient.send({ cmd: 'get_stock_by_almacen' }, { id_almacen: id, id_empresa: req.user.empresaId });
  }

  @Post('almacenes/:id')
  @RequirePermissions('almacenes:editar')
  actualizarAlmacen(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.natsClient.send({ cmd: 'update_almacen' }, { id, updateData: data, id_empresa: req.user.empresaId });
  }

  @Post('almacenes/delete/:id')
  @RequirePermissions('almacenes:eliminar')
  eliminarAlmacen(@Param('id') id: string, @Req() req: any) {
    return this.natsClient.send({ cmd: 'delete_almacen' }, { id, id_empresa: req.user.empresaId });
  }
}