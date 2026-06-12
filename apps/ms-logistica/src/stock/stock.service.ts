import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private readonly stockRepo: Repository<Stock>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

    async actualizarStock(id_producto: string, id_almacen: string, cantidad: number, tipo: string, id_empresa?: string) {
        let stock = await this.stockRepo.findOne({ where: { id_producto, id_almacen } });

        if (!stock) {
            stock = this.stockRepo.create({ id_producto, id_almacen, cantidad: 0, id_empresa });
        }

        if (tipo === 'ENTRADA') {
            stock.cantidad += cantidad;
        } else {
            stock.cantidad -= cantidad;
        }

        return await this.stockRepo.save(stock);
    }

    async getStockPorAlmacen(id_almacen: string) {
        return await this.stockRepo.find({
            where: { id_almacen }
        });
    }

    async getStockPorProducto(id_producto: string) {
        return await this.stockRepo.find({
            where: { id_producto }
        });
    }

    private readonly logger = new Logger('StockService');

    async inicializarStock(productoId: string, id_almacen: string = '00000000-0000-0000-0000-000000000000', id_empresa?: string) {
        const existe = await this.stockRepo.findOne({ where: { id_producto: productoId, id_almacen } });
        if (existe) return existe;
        const nuevoStock = this.stockRepo.create({ id_producto: productoId, id_almacen, cantidad: 0, id_empresa });
        this.logger.log(`Stock inicializado a 0 para el producto: ${productoId}`);
        return await this.stockRepo.save(nuevoStock);
    }

    async descontarStock(productoId: string, cantidadVendida: number, id_empresa?: string) {
        const stockActual = await this.stockRepo.findOne({ where: { id_producto: productoId } });

        if (!stockActual) {
            this.logger.error(`CRÍTICO: Intentando descontar producto ${productoId} que no existe en stock.`);
            throw new NotFoundException(`Stock no encontrado para el producto ${productoId}`);
        }
        stockActual.cantidad -= cantidadVendida;
        await this.stockRepo.save(stockActual);
        this.logger.log(`Éxito | Producto: ${productoId} | Nuevo stock disponible: ${stockActual.cantidad}`);

        this.natsClient.emit('stock_actualizado', {
            productoId: stockActual.id_producto,
            nuevaCantidad: stockActual.cantidad
        });

        return stockActual;
    }
}