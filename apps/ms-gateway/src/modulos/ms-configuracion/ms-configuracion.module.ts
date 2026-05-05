import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfiguracionController } from './ms-configuracion.controller';

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
  controllers: [ConfiguracionController],
})
export class MsConfiguracionModule {}