import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { NatsModule } from '@app/common/transport/nats/nats.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Venta]),
        NatsModule,
    ],
    controllers: [VentasController],
    providers: [VentasService],
})
export class VentasModule { }