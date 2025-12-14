import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <--- Importante

@Module({
  imports: [
    // Añadimos ConfigModule para leer el .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    
    ClientsModule.registerAsync([
      {
        name: 'ADMINISTRACION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            // Leemos el host del .env
            host: configService.get('MS_ADMINISTRACION_HOST'), 
            // Leemos el puerto interno (3000)
            port: configService.get('MS_ADMINISTRACION_PORT'), 
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}