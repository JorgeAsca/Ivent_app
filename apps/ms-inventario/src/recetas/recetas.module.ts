import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { RecetaIngrediente } from './entities/receta-ingrediente.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RecetaIngrediente, Producto]),
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : ['nats://localhost:4222'],
                },
            },
        ]),
    ],
    controllers: [RecetasController],
    providers: [RecetasService],
    exports: [RecetasService]
})
export class RecetasModule {}
