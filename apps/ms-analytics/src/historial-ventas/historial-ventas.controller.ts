import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HistorialVentasService } from './historial-ventas.service';
import { CreateHistorialVentaDto } from './dto/create-historial-venta.dto';

@Controller()
export class HistorialVentasController {
    constructor(private readonly service: HistorialVentasService) { }

    @MessagePattern({ cmd: 'track_sale_event' })
    trackSale(@Payload() dto: CreateHistorialVentaDto) {
        return this.service.registrarVenta(dto);
    }
}