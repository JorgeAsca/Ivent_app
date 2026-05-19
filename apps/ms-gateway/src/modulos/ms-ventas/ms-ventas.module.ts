import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsVentasController } from './ms-ventas.controller';
import { VentasController } from 'apps/ms-ventas/src/ventas/ventas.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MS__SERVICE',
        transport: Transport.NATS,
        options: { servers: ['nats://nats-server1:4222'] },
      },
    ]),
  ],
  controllers: [MsVentasController],
})
export class MsVentasModule {}