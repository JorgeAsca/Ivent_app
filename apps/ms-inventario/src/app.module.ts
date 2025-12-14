import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs'; 
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envs.databaseUrl, 
      autoLoadEntities: true, 
      synchronize: true, 
    }),

    
    ProductosModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}