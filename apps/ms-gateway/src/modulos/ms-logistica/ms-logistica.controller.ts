import { Controller, Get, Param, Inject, Post, Body } from '@nestjs/common';
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
    // Redirigimos el JSON recibido directo al patrón que espera el microservicio
    return this.natsClient.send({ cmd: 'crear_movimiento' }, data);
  }
}