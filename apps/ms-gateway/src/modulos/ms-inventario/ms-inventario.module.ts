import { Module } from '@nestjs/common';
import { InventarioController } from './ms-inventario.controller';

@Module({
  controllers: [InventarioController],
})
export class InventarioModule {}