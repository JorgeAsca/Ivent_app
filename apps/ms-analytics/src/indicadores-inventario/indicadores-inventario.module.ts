import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicadorInventario } from './entities/indicador-inventario.entity';
import { IndicadoresInventarioService } from './indicadores-inventario.service';
import { IndicadoresInventarioController } from './indicadores-inventario.controller';

@Module({
    imports: [TypeOrmModule.forFeature([IndicadorInventario])],
    controllers: [IndicadoresInventarioController],
    providers: [IndicadoresInventarioService],
})
export class IndicadoresInventarioModule { }