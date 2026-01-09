import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IndicadoresInventarioModule } from './indicadores-inventario/indicadores-inventario.module';
import { HistorialVentasModule } from './historial-ventas/historial-ventas.module';
import { RendimientoModule } from './rendimiento/rendimiento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'db_analytics',
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
    }),
    IndicadoresInventarioModule,
    HistorialVentasModule,
    RendimientoModule,
  ],
})
export class AppModule { }