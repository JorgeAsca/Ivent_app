import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReglasPedidoService } from './reglas-pedido.service';
import { ReglasPedidoController } from './reglas-pedido.controller';
import { ReglaPedido } from './entities/regla-pedido.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReglaPedido]),
        // Importante: Registrar el cliente para hablar con el barril de analytics
        ClientsModule.register([
            {
                name: 'ANALYTICS_SERVICE',
                transport: Transport.TCP,
                options: { host: 'ms-analytics', port: 3000 },
            },
        ]),
    ],
    controllers: [ReglasPedidoController],
    providers: [ReglasPedidoService],
})
export class ReglasPedidoModule { }