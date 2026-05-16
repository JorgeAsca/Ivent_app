import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { IndicadoresInventarioService } from './indicadores-inventario.service';
import { SyncInventoryDto } from './dto/sync-inventory.dto';

@Controller()
export class IndicadoresInventarioController {
    constructor(private readonly service: IndicadoresInventarioService) { }

    @MessagePattern({ cmd: 'sync_inventory_data' })
    syncData(@Payload() dto: SyncInventoryDto) {
        return this.service.actualizarDesdeInventario(dto);
    }

    @MessagePattern({ cmd: 'get_product_analytics' })
    getProductAnalytics(@Payload() data: { id_producto: string }) {
        return this.service.obtenerStatusParaTerceros(data.id_producto);
    }

    @EventPattern('stock_actualizado')
  async actualizarKPISStock(@Payload() data: { productoId: string, nuevaCantidad: number }) {
    console.log(`[ms-analytics] Actualizando KPI de stock para el producto ${data.productoId}. Nueva cantidad: ${data.nuevaCantidad}`);
    
    // Lógica en tu servicio para evaluar si la cantidad es menor al mínimo permitido
    // y disparar una alerta en el dashboard si es necesario.
    await this.service.evaluarNivelesStock(data.productoId, data.nuevaCantidad);
  }
}