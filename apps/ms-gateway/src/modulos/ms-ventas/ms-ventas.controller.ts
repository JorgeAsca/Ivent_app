import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ventas')
export class MsVentasController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Post()
  createVenta(@Body() createVentaDto: any) {
    console.log('Recibiendo petición HTTP para crear venta...');
    // Se lo pasamos a NATS para que ms-ventas lo procese
    return this.natsClient.send({ cmd: 'create_venta' }, createVentaDto);
  }
}