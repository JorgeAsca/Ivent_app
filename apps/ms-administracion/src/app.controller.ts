import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello from ms-administracion!';
  }
  
  @MessagePattern({ cmd: 'crear_rol' })
  crearRol(@Payload() data: any) {
    return this.appService.crearRol(data);
  }
}
