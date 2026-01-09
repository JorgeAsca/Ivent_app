import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AlmacenesModule } from './almacenes/almacenes.module';
import { StockModule } from './stock/stock.module';
import { MovimientosModule } from './movimientos/movimientos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'db_logistica',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AlmacenesModule,
    StockModule,
    MovimientosModule,
  ],
})
export class AppModule { }