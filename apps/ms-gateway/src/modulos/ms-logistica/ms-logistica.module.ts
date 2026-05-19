import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsLogisticaController } from './ms-logistica.controller';

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
  controllers: [MsLogisticaController],
})
export class MsLogisticaModule {}