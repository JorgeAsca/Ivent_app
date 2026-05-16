import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { HistorialVentasService } from './historial-ventas.service';
import { CreateHistorialVentaDto } from './dto/create-historial-venta.dto';

@Controller()
export class HistorialVentasController {
    constructor(private readonly service: HistorialVentasService) { }

    @MessagePattern({ cmd: 'track_sale_event' })
    trackSale(@Payload() dto: CreateHistorialVentaDto) {
        return this.service.registrarVenta(dto);
    }

    @EventPattern('venta_realizada')
    async registrarVentaAnalytics(@Payload() data: { productoId: string, cantidad: number, ventaId: string }) {
        console.log(`[ms-analytics] Registrando venta ${data.ventaId} para gráficas.`);
        await this.service.registrarMetricaVenta(data);
    }
}