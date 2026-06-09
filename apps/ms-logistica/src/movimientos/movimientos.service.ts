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
        @Inject('NATS_SERVICE')
        private readonly natsClient: ClientProxy,
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

            // Notificamos al barril de analytics e inventario via NATS
            this.natsClient.emit({ cmd: 'sync_inventory_data' }, {
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

    async findAll(id_empresa: string) {
        // Obtenemos los almacenes de la empresa
        const almacenes = await this.repo.manager.query(
            `SELECT id FROM almacenes WHERE id_empresa = $1`, [id_empresa]
        );
        const idsAlmacenes = almacenes.map((a: any) => a.id);

        if (idsAlmacenes.length === 0) return [];

        return await this.repo.createQueryBuilder('movimiento')
            .where('movimiento.id_almacen IN (:...ids)', { ids: idsAlmacenes })
            .orderBy('movimiento.fecha_movimiento', 'DESC')
            .getMany();
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