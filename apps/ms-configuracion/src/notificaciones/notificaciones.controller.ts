import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificacionesService } from './notificaciones.service';

@Controller()
export class NotificacionesController {
  private readonly logger = new Logger(NotificacionesController.name);

  constructor(private readonly notificacionesService: NotificacionesService) {}

  @EventPattern('alerta_stock_bajo')
  async handleAlertaStockBajo(@Payload() data: any) {
    this.logger.log(`Evento alerta_stock_bajo recibido para producto: ${data.nombre}`);
    await this.notificacionesService.procesarAlertaStockBajo(data);
  }
}
