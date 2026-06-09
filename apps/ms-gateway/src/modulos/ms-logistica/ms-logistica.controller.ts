import { Controller, Get, Param, Inject, Post, Body, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('logistica')
export class MsLogisticaController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Get('stock/:productoId')
  obtenerStock(@Param('productoId') productoId: string) {
    console.log(`Recibiendo petición HTTP para consultar stock del producto: ${productoId}`);
    
    // CORREGIDO: Enviamos un objeto estructurado en lugar de un string suelto
    return this.natsClient.send({ cmd: 'obtener_stock' }, { productoId });
  } 

  @Post('movimientos')
  crearMovimiento(@Body() data: any) {
    console.log('Recibiendo petición HTTP para crear movimiento de stock:', data);
    return this.natsClient.send({ cmd: 'crear_movimiento' }, data);
  }

  @Get('movimientos')
  listarMovimientos(@Query('empresaId') empresaId: string) {
    return this.natsClient.send({ cmd: 'listar_movimientos' }, { id_empresa: empresaId });
  }

  @Get('almacenes')
  listarAlmacenes(@Query('empresaId') empresaId: string) {
    return this.natsClient.send({ cmd: 'find_all_almacenes' }, empresaId || '');
  }

  @Post('almacenes')
  crearAlmacen(@Body() data: any) {
    return this.natsClient.send({ cmd: 'create_almacen' }, data);
  }

  @Get('almacenes/:id/stock')
  obtenerStockAlmacen(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'get_stock_by_almacen' }, { id_almacen: id });
  }

  @Post('almacenes/:id')
  actualizarAlmacen(@Param('id') id: string, @Body() data: any) {
    return this.natsClient.send({ cmd: 'update_almacen' }, { id, updateData: data });
  }

  @Post('almacenes/delete/:id')
  eliminarAlmacen(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'delete_almacen' }, id);
  }
}