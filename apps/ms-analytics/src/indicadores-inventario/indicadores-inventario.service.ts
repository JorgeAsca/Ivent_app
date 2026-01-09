import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicadorInventario } from './entities/indicador-inventario.entity';
import { SyncInventoryDto } from './dto/sync-inventory.dto';

@Injectable()
export class IndicadoresInventarioService {
    constructor(
        @InjectRepository(IndicadorInventario)
        private readonly repo: Repository<IndicadorInventario>,
    ) { }

    // Recibe datos de ms-inventario
    async actualizarDesdeInventario(dto: SyncInventoryDto) {
        let indicador = await this.repo.findOneBy({ id_producto: dto.id_producto });

        if (indicador) {
            indicador.stock_actual = dto.stock_actual;
        } else {
            indicador = this.repo.create(dto);
        }
        return await this.repo.save(indicador);
    }

    // Responde a ms-terceros
    async obtenerStatusParaTerceros(id_producto: string) {
        return await this.repo.findOneBy({ id_producto });
    }
}