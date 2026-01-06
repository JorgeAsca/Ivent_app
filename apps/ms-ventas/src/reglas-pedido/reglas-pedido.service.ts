import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReglaPedido } from './entities/regla-pedido.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReglasPedidoService {
    constructor(
        @InjectRepository(ReglaPedido) private readonly repo: Repository<ReglaPedido>,
        @Inject('ANALYTICS_SERVICE') private readonly clientAnalytics: ClientProxy,
    ) { }

    // Lógica principal: Consulta al barril de analytics
    async verificarYProcesar(id_empresa: string) {
        const reglas = await this.repo.find({ where: { id_empresa, activo: true } });

        for (const regla of reglas) {
            // Jalamos datos del barril
            const status = await firstValueFrom(
                this.clientAnalytics.send({ cmd: 'get_product_analytics' }, { id_producto: regla.id_producto })
            );

            if (status.stock_actual <= regla.stock_minimo) {
                // Aquí se dispararía el pedido automático
                console.log(`ORDEN AUTOMÁTICA: Producto ${regla.id_producto} al Proveedor ${regla.id_proveedor}`);
            }
        }
    }
}