import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private readonly stockRepo: Repository<Stock>,
    ) { }

    async actualizarStock(id_producto: string, id_almacen: string, cantidad: number, tipo: string) {
        let stock = await this.stockRepo.findOne({ where: { id_producto, id_almacen } });

        if (!stock) {
            stock = this.stockRepo.create({ id_producto, id_almacen, cantidad: 0 });
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
}