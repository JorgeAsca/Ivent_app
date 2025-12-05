import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Agregamos esto para habilitar las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ms-administracion/.env', '.env'], 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AdministracionModule {}
// Mantén tu export como lo tenías
export { AdministracionModule as AppModule };