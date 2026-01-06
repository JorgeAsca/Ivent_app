import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TipoDocumentoModule } from './tipo-documento/tipo-documento.module';
import { ConfiguracionEmpresaModule } from './configuracion-empresa/configuracion-empresa.module';
import { ConfiguracionGlobalModule } from './configuracion-global/configuracion-global.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'db_configuracion',
      autoLoadEntities: true, 
      synchronize: true, // Solo para desarrollo
    }),
    TipoDocumentoModule,
    ConfiguracionEmpresaModule,
    ConfiguracionGlobalModule,
  ],
})
export class AppModule {}