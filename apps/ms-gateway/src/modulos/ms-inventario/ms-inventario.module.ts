import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventarioController } from './ms-inventario.controller';
import { envs } from '../../../config/envs'; 

@Module({
  imports: [
    // Usamos register para simplicidad si ya tienes los envs cargados globalmente
    ClientsModule.register([
      {
        name: 'INVENTARIO_SERVICE',
        transport: Transport.NATS,
        options: {
          
          servers: envs.natsServers, 
        },
      },
    ]),
  ],
  controllers: [InventarioController],
  
  exports: [ClientsModule], 
})
export class InventarioModule {}