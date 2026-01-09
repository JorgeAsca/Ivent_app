import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ],
    controllers: [MovimientosController],
    providers: [MovimientosService],
})
export class MovimientosModule { }