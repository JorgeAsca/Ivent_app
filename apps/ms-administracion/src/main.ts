import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Ms-Administracion');

 
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: envs.port, 
    },
  });

  await app.listen();
  logger.log(`Microservicio Administración corriendo en puerto ${envs.port}`);
}
bootstrap();