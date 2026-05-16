import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs'; 

async function bootstrap() { 
  const logger = new Logger('Ms-Analytics');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  });

  await app.listen();
  logger.log(`Microservicio Analytics corriendo en puerto ${envs.port}`);
}
bootstrap();