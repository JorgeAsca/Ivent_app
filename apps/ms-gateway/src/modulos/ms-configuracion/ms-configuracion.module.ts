import { Module } from '@nestjs/common';
import { ConfiguracionController } from './ms-configuracion.controller';

@Module({
  controllers: [ConfiguracionController],
})
export class MsConfiguracionModule {}