import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs'; //

async function bootstrap() {
  const logger = new Logger('Ms-Inventario');


  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: envs.port,
    },
  });

  await app.listen();
  logger.log(`Microservicio Inventario corriendo en puerto ${envs.port}`);
}
bootstrap();