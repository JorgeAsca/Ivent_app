import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { envs } from '../config/envs';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api'); 
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
  
  await app.listen(envs.port);
  logger.log(`Gateway escuchando en puerto: ${envs.port}`);
}
bootstrap();