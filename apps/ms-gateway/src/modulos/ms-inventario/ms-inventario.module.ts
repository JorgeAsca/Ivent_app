import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InventarioController } from './ms-inventario.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INVENTARIO_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('MS_INVENTARIO_HOST'), 
            
            port: Number(configService.get('MS_INVENTARIO_PORT')), 
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventarioController],
})
export class InventarioModule {}