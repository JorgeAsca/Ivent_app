import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @MessagePattern({ cmd: 'get_stock_by_producto' })
    async getByProducto(@Payload() data: { id_producto: string }) {
        return await this.stockService.getStockPorProducto(data.id_producto);
    }

    @EventPattern('venta_realizada')
    async handleVentaRealizada(@Payload() data: { productoId: string, cantidad: number, ventaId: string }) {
        console.log(`[ms-logistica] Evento atrapado: Se vendieron ${data.cantidad} unidades del producto ${data.productoId}`);

        // Llamamos a nuestro servicio para actualizar la base de datos de logística
        await this.stockService.descontarStock(data.productoId, data.cantidad);
    }

    @MessagePattern({ cmd: 'get_stock_by_almacen' })
    async getByAlmacen(@Payload() data: { id_almacen: string }) {
        return await this.stockService.getStockPorAlmacen(data.id_almacen);
    }

    @EventPattern('producto_creado')
    async handleProductoCreado(@Payload() data: { productoId: string, nombre: string }) {
        console.log(`[ms-logistica] Evento atrapado: Inicializando stock para el nuevo producto ${data.nombre} (${data.productoId})`);


        await this.stockService.inicializarStock(data.productoId);
    }
}