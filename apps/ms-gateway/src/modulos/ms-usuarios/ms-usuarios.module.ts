import { Module } from '@nestjs/common';
import { NatsModule } from '../../transport/nats/nats.module';
import { UsuariosController } from './ms-usuarios.controller';

@Module({
  imports: [NatsModule],
  controllers: [UsuariosController],
})
export class MsUsuariosModule {}