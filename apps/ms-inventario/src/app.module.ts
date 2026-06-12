import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs'; 
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { RecetasModule } from './recetas/recetas.module';

@Module({
  imports: [
    // 1. Configuración global de variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    
    // 2. Conexión a Base de Datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      url: envs.databaseUrl, 
      autoLoadEntities: true, 
      synchronize: true, 
    }),

    // 3. Módulos de negocio
    ProductosModule,
    CategoriasModule,
    RecetasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}