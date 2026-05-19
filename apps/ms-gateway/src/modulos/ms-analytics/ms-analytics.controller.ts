import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('analytics')
export class MsAnalyticsController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Get('historial-ventas')
  obtenerHistorial() {
    console.log('Recibiendo petición HTTP para ver las gráficas de ventas...');
    return this.natsClient.send({ cmd: 'obtener_historial_ventas' }, {});
  }
}