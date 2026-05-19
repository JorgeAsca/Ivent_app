import { Module } from '@nestjs/common';
import { MsAnalyticsController } from './ms-analytics.controller';

@Module({
  // NO importes ClientsModule aquí. 
  // Al ser NatsModule global, el token 'NATS_SERVICE' ya está disponible.
  controllers: [MsAnalyticsController],
})
export class MsAnalyticsModule {}