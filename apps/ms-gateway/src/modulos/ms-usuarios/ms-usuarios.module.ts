import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsuariosController } from './ms-usuarios.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MS_USUARIOS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'ms-usuarios', port: 3000 },
      },
    ]),
  ],
  controllers: [UsuariosController],
})
export class MsUsuariosModule {}