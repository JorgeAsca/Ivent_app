import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Ms-Inventario');
  
  
  const port = process.env.inventario_PORT ? parseInt(process.env.inventario_PORT) : 3002;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port,
    },
  });

  await app.listen();
  logger.log(`Microservicio Inventario corriendo en puerto ${port}`);
}
bootstrap();