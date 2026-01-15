import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'apps/ms-gateway/config/envs'; // Ajusta la ruta a tus envs

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers,
                }
            },
        ]),
    ],
    exports: [ClientsModule]
})
export class NatsModule { }