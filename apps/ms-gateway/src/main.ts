import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Definimos el puerto en una variable simple
  const port = 3000; 
  
  await app.listen(port);
  
  // Mensaje bonito para la consola
  console.log(`Gateway escuchando peticiones HTTP en: http://localhost:${port}`);
}
bootstrap();