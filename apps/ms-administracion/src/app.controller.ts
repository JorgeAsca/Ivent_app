import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'crear_empresa' }) 
  async createEmpresa(@Payload() data: any) {
    return this.appService.createEmpresa(data);
  }

  @MessagePattern({ cmd: 'crear_rol' })
  async createRol(@Payload() data: any) {
    console.log('Microservicio recibiendo rol:', data);
    return this.appService.crearRol(data); 
  }
}