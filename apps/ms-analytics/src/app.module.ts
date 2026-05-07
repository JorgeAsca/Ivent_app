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
      host: process.env.DB_HOST || 'db-analytics',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,      // <--- Esta es la clave
      password: process.env.DB_PASSWORD,  // <--- Esta es la clave
      database: process.env.DB_NAME,      // <--- Esta es la clave
      autoLoadEntities: true,
      synchronize: true
    }),
    IndicadoresInventarioModule,
    HistorialVentasModule,
    RendimientoModule,
  ],
})
export class AppModule { }