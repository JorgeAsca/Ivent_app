import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialVenta } from './entities/historial-venta.entity';
import { CreateHistorialVentaDto } from './dto/create-historial-venta.dto';

@Injectable()
export class HistorialVentasService {
    constructor(
        @InjectRepository(HistorialVenta)
        private readonly repo: Repository<HistorialVenta>,
    ) { }

    async registrarVenta(dto: CreateHistorialVentaDto) {
        const nuevaVenta = this.repo.create(dto);
        return await this.repo.save(nuevaVenta);
    }

    async registrarMetricaVenta(data: { productoId: string, cantidad: number, ventaId: string }) {
        const nuevaVenta = this.repo.create({
            id_venta: data.ventaId,
            id_producto: data.productoId,
            cantidad: data.cantidad,
            id_empresa: '00000000-0000-0000-0000-000000000000',
            precio_total: 0,
        });
        return await this.repo.save(nuevaVenta);
    }

    async obtenerPromedioVentas(id_producto: string) {
        // Lógica para calcular proyecciones en el futuro
        return await this.repo.find({ where: { id_producto }, take: 10 });
    }
}