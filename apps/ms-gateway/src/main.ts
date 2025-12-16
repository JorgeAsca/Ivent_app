import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');
  
 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
  
  const port = 3000; 
  await app.listen(port);
  
  logger.log(`Gateway escuchando peticiones HTTP en: http://localhost:${port}`);
}
bootstrap();