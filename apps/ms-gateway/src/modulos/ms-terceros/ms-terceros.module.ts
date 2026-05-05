import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TercerosController } from './ms-terceros.controller';

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
  controllers: [TercerosController],
})
export class MsTercerosModule {}