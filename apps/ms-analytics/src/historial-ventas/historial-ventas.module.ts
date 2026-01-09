import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialVenta } from './entities/historial-venta.entity';
import { HistorialVentasService } from './historial-ventas.service';
import { HistorialVentasController } from './historial-ventas.controller';

@Module({
    imports: [TypeOrmModule.forFeature([HistorialVenta])],
    controllers: [HistorialVentasController],
    providers: [HistorialVentasService],
})
export class HistorialVentasModule { }