import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnalyticsController } from './ms-analytics.controller';

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
  controllers: [AnalyticsController],
})
export class MsAnalyticsModule {}