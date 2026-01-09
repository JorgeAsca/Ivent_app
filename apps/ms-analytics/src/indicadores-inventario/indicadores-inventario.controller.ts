import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IndicadoresInventarioService } from './indicadores-inventario.service';
import { SyncInventoryDto } from './dto/sync-inventory.dto';

@Controller()
export class IndicadoresInventarioController {
    constructor(private readonly service: IndicadoresInventarioService) { }

    // Comando para recibir datos de Inventario/Ventas
    @MessagePattern({ cmd: 'sync_inventory_data' })
    syncData(@Payload() dto: SyncInventoryDto) {
        return this.service.actualizarDesdeInventario(dto);
    }

    // Comando que usa ms-terceros para su motor de pedidos
    @MessagePattern({ cmd: 'get_product_analytics' })
    getProductAnalytics(@Payload() data: { id_producto: string }) {
        return this.service.obtenerStatusParaTerceros(data.id_producto);
    }
}