import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common'; // <--- IMPORTAR ESTO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');

  // --- AGREGAR ESTAS LÍNEAS ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían datos extra
      transform: true, // Convierte "10" a 10 automáticamente (vital para tus números)
    }),
  );
  // ----------------------------
  
  const port = 3000; 
  await app.listen(port);
  
  logger.log(`Gateway escuchando peticiones HTTP en: http://localhost:${port}`);
}
bootstrap();