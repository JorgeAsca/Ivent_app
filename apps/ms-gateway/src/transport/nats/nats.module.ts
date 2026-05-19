import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../../config/envs';

@Global() // Esto hace que el servicio esté disponible en toda la app sin importar el módulo
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE', // El token que buscan tus controladores
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers,
                }
            },
        ]),
    ],
    exports: [
        ClientsModule, // Exportamos el ClientsModule para que otros módulos puedan usar los clientes registrados
    ]
})
export class NatsModule { }