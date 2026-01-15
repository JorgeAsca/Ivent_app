import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../../config/envs'; // Usando el envs.ts que acabamos de crear

@Module({
    imports: [
        ClientsModule.register([
            {
                // Este nombre es la clave que usaremos para inyectar el cliente en los controladores
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers,
                }
            },
        ]),
    ],
    exports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers,
                }
            },
        ]),
    ]
})
export class NatsModule { }