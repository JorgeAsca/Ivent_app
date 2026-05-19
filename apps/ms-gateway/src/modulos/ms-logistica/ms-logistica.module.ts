import { Module } from '@nestjs/common';
import { MsLogisticaController } from './ms-logistica.controller';

@Module({
  controllers: [MsLogisticaController],
})
export class MsLogisticaModule {}