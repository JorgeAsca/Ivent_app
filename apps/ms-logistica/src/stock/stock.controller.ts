import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @MessagePattern({ cmd: 'get_stock_by_producto' })
    async getByProducto(@Payload() data: { id_producto: string }) {
        return await this.stockService.getStockPorProducto(data.id_producto);
    }

    @MessagePattern({ cmd: 'get_stock_by_almacen' })
    async getByAlmacen(@Payload() data: { id_almacen: string }) {
        return await this.stockService.getStockPorAlmacen(data.id_almacen);
    }
}