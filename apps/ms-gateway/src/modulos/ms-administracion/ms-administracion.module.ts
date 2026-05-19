import { Module } from '@nestjs/common';
import { NatsModule } from '../../transport/nats/nats.module';
import { AdministracionController } from './ms-administracion.controller';

@Module({
  imports: [NatsModule],
  controllers: [AdministracionController],
})
export class AdministracionModule { }