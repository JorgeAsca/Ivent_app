import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VentasService {
    private readonly logger = new Logger('Ms-Ventas');

    constructor(
        @InjectRepository(Venta)
        private readonly ventaRepository: Repository<Venta>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) { }

    async create(createVentaDto: CreateVentaDto) {
        const nuevaVenta = this.ventaRepository.create(createVentaDto);
        const ventaGuardada = await this.ventaRepository.save(nuevaVenta);

        this.logger.log(`Venta confirmada en BD con ID: ${ventaGuardada.id}`);
        this.natsClient.emit('venta_realizada', {
            productoId: ventaGuardada.productoId,
            cantidad: ventaGuardada.cantidad,
            ventaId: ventaGuardada.id
        });

        return ventaGuardada;
    }
}