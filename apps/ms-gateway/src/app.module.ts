import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AdministracionModule } from './modulos/ms-administracion/ms-administracion.module';
import { InventarioModule } from './modulos/ms-inventario/ms-inventario.module';
import { MsUsuariosModule } from './modulos/ms-usuarios/ms-usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    AdministracionModule,
    InventarioModule,
    MsUsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}