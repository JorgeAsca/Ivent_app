import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { firstValueFrom } from 'rxjs';

@Controller()
export class StockController {
    constructor(
        private readonly stockService: StockService,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

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
    async handleVentaRealizada(@Payload() data: { productoId: string, cantidad: number, ventaId: string, id_empresa: string, ticket_id?: string }) {
        console.log(`[ms-logistica] Evento atrapado: Se vendieron ${data.cantidad} unidades del producto ${data.productoId} (Ticket: ${data.ticket_id})`);

        try {
            // 1. Obtener información del producto para saber si es COMPUESTO
            const producto = await firstValueFrom(this.natsClient.send({ cmd: 'buscar_producto' }, {
                id: data.productoId,
                id_empresa: data.id_empresa
            }));

            if (producto && producto.tipo === 'COMPUESTO') {
                console.log(`[ms-logistica] El producto ${data.productoId} es COMPUESTO. Descontando ingredientes...`);
                // 2. Obtener receta
                const receta = await firstValueFrom(this.natsClient.send({ cmd: 'obtener_receta' }, {
                    producto_id: data.productoId,
                    id_empresa: data.id_empresa
                }));

                if (receta && receta.length > 0) {
                    for (const item of receta) {
                        const cantidadADescontar = item.cantidad_necesaria * data.cantidad;
                        const stockItem = await this.stockService.getStockPorProducto(item.ingrediente_id);
                        const id_almacen = item.id_almacen || (stockItem.length > 0 ? stockItem[0].id_almacen : '00000000-0000-0000-0000-000000000000');
                        
                        await firstValueFrom(this.natsClient.send({ cmd: 'crear_movimiento' }, {
                            id_producto: item.ingrediente_id,
                            id_almacen: id_almacen,
                            cantidad: cantidadADescontar,
                            tipo: 'SALIDA',
                            id_empresa: data.id_empresa,
                            referencia_externa: data.ventaId,
                            ticket_id: data.ticket_id,
                            motivo: 'SALIDA (VENTA)'
                        }));
                    }
                    return; // Terminamos aquí para compuestos
                } else {
                    console.warn(`[ms-logistica] Producto compuesto ${data.productoId} no tiene receta configurada. Se descontará el producto en sí.`);
                }
            }

            // Si es SIMPLE o no tiene receta, registrar movimiento normal
            const stockActual = await this.stockService.getStockPorProducto(data.productoId);
            const id_almacen = stockActual.length > 0 ? stockActual[0].id_almacen : '00000000-0000-0000-0000-000000000000';

            await firstValueFrom(this.natsClient.send({ cmd: 'crear_movimiento' }, {
                id_producto: data.productoId,
                id_almacen: id_almacen,
                cantidad: data.cantidad,
                tipo: 'SALIDA',
                id_empresa: data.id_empresa,
                referencia_externa: data.ventaId,
                ticket_id: data.ticket_id,
                motivo: 'SALIDA (VENTA)'
            }));
        } catch (error) {
            console.error(`[ms-logistica] Error al procesar venta_realizada: ${error.message}`);
        }
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