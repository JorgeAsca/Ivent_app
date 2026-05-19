import { Module } from '@nestjs/common';
import { MsVentasController } from './ms-ventas.controller';
import { NatsModule } from '../../transport/nats/nats.module'; 

@Module({
  imports: [
    NatsModule, // Usamos el módulo que ya maneja la conexión a NATS
  ],
  controllers: [MsVentasController],
})
export class MsVentasModule {}