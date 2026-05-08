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
                name: 'ANALYTICS_SERVICE',
                transport: Transport.TCP,
                options: { host: 'ms-analytics', port: 3000 },
            },
        ]),
        StockModule,
    ],
    controllers: [MovimientosController],
    providers: [MovimientosService],
})
export class MovimientosModule { }