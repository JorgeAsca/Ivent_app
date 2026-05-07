import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicadoresInventarioModule } from './indicadores-inventario/indicadores-inventario.module';
import { HistorialVentasModule } from './historial-ventas/historial-ventas.module';
import { RendimientoModule } from './rendimiento/rendimiento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'db-analytics',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    IndicadoresInventarioModule,
    HistorialVentasModule,
    RendimientoModule,
  ],
})
export class AppModule {}