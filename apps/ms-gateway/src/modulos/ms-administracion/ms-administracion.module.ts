import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdministracionController } from './ms-administracion.controller';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'ADMINISTRACION_SERVICE', 
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP, 
                    options: {
                        host: configService.get('MS_ADMINISTRACION_HOST'),
                        port: configService.get('MS_ADMINISTRACION_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AdministracionController],
})
export class AdministracionModule { }