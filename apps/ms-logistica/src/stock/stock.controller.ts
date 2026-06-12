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

    @MessagePattern({ cmd: 'obtener_stock' })
    obtenerStock(@Payload() data: any) {
        // CORREGIDO: Extrae de forma segura el ID tanto si viene un objeto { productoId } como si fuera un string plano
        const id = typeof data === 'object' && data !== null ? data.productoId || data.id : data;

        console.log(`Buscando stock en la base de datos para el producto ID: ${id}`);
        return this.stockService.getStockPorProducto(id);
    }

    @EventPattern('venta_realizada')
    async handleVentaRealizada(@Payload() data: { productoId: string, cantidad: number, ventaId: string, id_empresa: string }) {
        console.log(`[ms-logistica] Evento atrapado: Se vendieron ${data.cantidad} unidades del producto ${data.productoId}`);

        // Llamamos a nuestro servicio para actualizar la base de datos de logística
        await this.stockService.descontarStock(data.productoId, data.cantidad, data.id_empresa);
    }

    @MessagePattern({ cmd: 'get_stock_by_almacen' })
    async getByAlmacen(@Payload() data: { id_almacen: string }) {
        return await this.stockService.getStockPorAlmacen(data.id_almacen);
    }

    @EventPattern('producto_creado')
    async handleProductoCreado(@Payload() data: { productoId: string, nombre: string, almacenId?: string }) {
        console.log(`[ms-logistica] Evento de producto creado recibido para ID: ${data.productoId}`);
        if (data.almacenId) {
            await this.stockService.inicializarStock(data.productoId, data.almacenId);
        }
    }
}