import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          // Lee directamente de la variable de entorno que pusimos en el .env
          servers: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}