import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from '../stock/stock.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { Movimiento } from './entities/movimiento.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movimiento]),
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_URL || 'nats://nats-server1:4222'],
                },
            },
        ]),
        StockModule,
    ],
    controllers: [MovimientosController],
    providers: [MovimientosService],
})
export class MovimientosModule { }