import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { StockService } from '../stock/stock.service';

@Injectable()
export class MovimientosService {
    private readonly logger = new Logger(MovimientosService.name);

    constructor(
        @InjectRepository(Movimiento)
        private readonly repo: Repository<Movimiento>,
        @Inject('ANALYTICS_SERVICE')
        private readonly clientAnalytics: ClientProxy,
        private readonly stockService: StockService,
    ) { }

    async registrarMovimiento(dto: CreateMovimientoDto) {
        try {
            const nuevo = this.repo.create(dto);
            const guardado = await this.repo.save(nuevo);

            await this.stockService.actualizarStock(
                guardado.id_producto,
                guardado.id_almacen,
                guardado.cantidad,
                guardado.tipo
            );

            // Calculamos el stock total sumando entradas y restando salidas
            const stockTotal = await this.calcularStockActual(guardado.id_producto);

            // Notificamos al barril de analytics
            this.clientAnalytics.emit({ cmd: 'sync_inventory_data' }, {
                id_producto: guardado.id_producto,
                id_empresa: dto.id_empresa,
                stock_actual: stockTotal
            });

            return guardado;
        } catch (error) {
            this.logger.error(`Error al registrar movimiento: ${error.message}`);
            throw error;
        }
    }

    async buscarPorProducto(id_producto: string) {
        return await this.repo.find({ where: { id_producto } });
    }

    private async calcularStockActual(id_producto: string): Promise<number> {
        const resultado = await this.repo
            .createQueryBuilder('movimiento')
            .select("SUM(CASE WHEN movimiento.tipo = 'ENTRADA' THEN movimiento.cantidad ELSE -movimiento.cantidad END)", "total")
            .where("movimiento.id_producto = :id", { id: id_producto })
            .getRawOne();

        return parseInt(resultado.total) || 0;
    }
}